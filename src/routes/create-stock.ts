import { auth } from "./middleware/auth";
import { database } from "../config/database";
import { FastifyInstance } from "fastify";

export async function createStock(app: FastifyInstance) {
  app.post("/api/stocks/", { preHandler: auth }, async(request, reply) => {
    const { userId } = request.cookies;

    const doesUserHasAStockAlready = await database.stock.findUnique({
      where: {
        userId
      }
    });

    if (doesUserHasAStockAlready) {
      return reply.status(400).send({ message: "User already has a stock." });
    }

    if (userId) {
      const stock = await database.stock.create({
        data: {
          userId
        }
      });

      return reply.status(201).send({ stockId: stock.id });
    }
  });
}
