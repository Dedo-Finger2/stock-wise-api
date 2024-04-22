import { auth } from "./middleware/auth";
import { database } from "../config/database";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function createManualShoppingList(app: FastifyInstance) {
  app.post("/api/shopping-lists/manual", { preHandler: auth }, async (request, reply) => {
    const requestCookiesSchema = z.object({
      userId: z.string().uuid()
    });

    const { userId } = requestCookiesSchema.parse(request.cookies);

    try {
      const newShoppingList = await database.shoppingList.create({
        data: {
          userId
        }
      });

      return reply.status(201).send({ shoppingListId: newShoppingList.id });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });
}
