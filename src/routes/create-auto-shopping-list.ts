import { auth } from "./middleware/auth";
import { database } from "../config/database";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function createAutoShoppingList(app: FastifyInstance) {
  app.post("/api/shopping-lists/auto", { preHandler: auth }, async (request, reply) => {
    const requestCookiesSchema = z.object({
      userId: z.string().uuid()
    });

    const { userId } = requestCookiesSchema.parse(request.cookies);

    try {
      const productsInStock = await database.stockProducts.findMany({
        where: {
          stock: {
            userId
          }
        },
        select: {
          product: {
            select: {
              id: true,
              name: true,
              type: {
                select: {
                  name: true
                }
              },
              unitType: {
                select: {
                  name: true
                }
              },
              minQuantity: true
            }
          },
          quantity: true
        }
      });

      const isThereAnyDangerProducts = productsInStock.filter((product) => product.quantity <= product.product.minQuantity);

      if (isThereAnyDangerProducts.length > 0) {
        const inDangerProductsIds = isThereAnyDangerProducts.map((product) => { return product.product.id; });

        const newShoppingList = await database.shoppingList.create({
          data: {
            userId
          }
        });

        await database.shoppingListProducts.createMany({
          data: inDangerProductsIds.map((product) => { return { shoppingListId: newShoppingList.id, productId: product }; })
        });

        return reply.status(201).send({ message: "New shopping list created." });
      }

      return reply.status(200).send({ message: "There is no product in danger in stock." });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });
}
