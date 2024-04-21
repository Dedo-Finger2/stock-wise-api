import { auth } from "./middleware/auth";
import { database } from "../config/database";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function removeProductFromShoppingList(app: FastifyInstance) {
  app.patch("/api/shopping-lists/:id/remove-product", { preHandler: auth }, async (request, reply) => {
    const requestBodySchema = z.object({
      productId: z.string().uuid()
    });
    const requestParamsSchema = z.object({
      id: z.string().uuid()
    });
    const requestCookiesSchema = z.object({
      userId: z.string().uuid()
    });

    const { userId } = requestCookiesSchema.parse(request.cookies);
    const { productId } = requestBodySchema.parse(request.body);
    const { id } = requestParamsSchema.parse(request.params);

    try {
      const productInShoppingList = await database.shoppingListProducts.findUnique({
        where: {
          productId_shoppingListId: {
            productId,
            shoppingListId: id
          },
          shoppingList: {
            userId
          },
          product: {
            userId
          }
        }
      });

      const productIsNotInShoppingList = !productInShoppingList;

      if (productIsNotInShoppingList) {
        return reply.status(400).send({ message: "Product is not in the shopping list." });
      }

      await database.shoppingListProducts.delete({
        where: {
          productId_shoppingListId: {
            productId,
            shoppingListId: id
          },
          shoppingList: {
            userId
          },
          product: {
            userId
          }
        }
      });

      return reply.status(200).send({ message: "Product removed from shopping list." });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });
}
