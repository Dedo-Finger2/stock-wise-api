import { auth } from "./middleware/auth";
import { database } from "../config/database";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function printShoppingList(app: FastifyInstance) {
  app.get("/api/shopping-lists/:id/print", { preHandler: auth }, async (request, reply) => {
    const requestParamsSchema = z.object({
      id: z.string().uuid()
    });
    const requestCookiesSchema = z.object({
      userId: z.string().uuid()
    });

    const { userId } = requestCookiesSchema.parse(request.cookies);
    const { id } = requestParamsSchema.parse(request.params);

    try {
      const shoppingList = await database.shoppingList.findUnique({
        where: {
          id
        }
      });

      const shoppingListDoesNotExists = !shoppingList;

      if (shoppingListDoesNotExists) {
        return reply.status(400).send({ message: "Shopping list does not exist." });
      }

      // Pegar os dados do produto
      const productsInShoppingList = await database.shoppingListProducts.findMany({
        select: {
          product: {
            select: {
              name: true,
              stocks: {
                where: {
                  stock: {
                    userId
                  }
                },
                select: {
                  quantity: true
                }
              },
              unitType: {
                select: {
                  name: true
                }
              },
              price: {
                // Pegar o preço mais atual do produto
                orderBy: {
                  createdAt: "desc"
                },
                select: {
                  price: true
                }
              }
            }
          }
        },
        where: {
          shoppingListId: id
        }
      });

      const isThereProductsInShoppingList = productsInShoppingList.length > 0;

      if (isThereProductsInShoppingList) {
        const productsInShoppingListFormated = productsInShoppingList.map((product) => {
          return {
            name: product.product.name,
            unitType: product.product.unitType?.name || "UNIDADE",
            latestPrice: product.product.price[0] !== undefined ? Number(Object.values(product.product.price[0])[0]) : undefined,
            quantityAtHome: Object.values(product.product.stocks[0])[0]
          };
        });

        return reply.status(200).send({ products: productsInShoppingListFormated });
      }

      return reply.status(400).send({ message: "The shopping list has no products" });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });
}
