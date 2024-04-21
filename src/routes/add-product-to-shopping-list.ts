import { auth } from "./middleware/auth";
import { database } from "../config/database";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function addProductToShoppingList(app: FastifyInstance) {
  app.post("/api/shopping-lists/:id/add-product", { preHandler: auth }, async (request, reply) => {
    const requestBodySchema = z.object({
      productId: z.string().uuid()
    });
    const requestParamsSchema = z.object({
      id: z.string().uuid()
    });
    const requestCookiesSchema = z.object({
      userId: z.string().uuid()
    });

    const { productId } = requestBodySchema.parse(request.body);
    const { userId } = requestCookiesSchema.parse(request.cookies);
    const { id } = requestParamsSchema.parse(request.params);

    try {
      const shoppingList = await database.shoppingList.findUnique({
        where: {
          id,
          userId
        }
      });

      const shoppingListDoesNotExists = !shoppingList;

      if (shoppingListDoesNotExists) {
        return reply.status(404).send({ message: "Could not find any shopping list." });
      }

      const isProductAlreadyInShoppingList = await database.shoppingListProducts.findUnique({
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

      if (isProductAlreadyInShoppingList) {
        return reply.status(400).send({ message: "Product is already in the shopping list." });
      }

      await database.shoppingListProducts.create({
        data: {
          shoppingListId: id,
          productId
        }
      });

      await database.shoppingList.update({
        where: {
          id,
          userId
        },
        data: {
          updatedAt: new Date()
        }
      });

      return reply.status(201).send({ message: "Product added to shopping list." });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });
}
