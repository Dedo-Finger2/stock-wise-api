import { auth } from "./middleware/auth";
import { database } from "../config/database";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function getProductPriceLogs(app: FastifyInstance) {
  app.get("/api/products/:id/price-log", { preHandler: auth }, async (request, reply) => {
    const requestParamsSchema = z.object({
      id: z.string().uuid()
    });
    const requestCookiesSchema = z.object({
      userId: z.string().uuid()
    });

    const { userId } = requestCookiesSchema.parse(request.cookies);
    const { id } = requestParamsSchema.parse(request.params);

    try {
      const product = await database.product.findUnique({
        where: {
          id,
          userId
        }
      });

      if (product) {
        const productPriceLogs = await database.productPriceLog.findMany({
          where: {
            productId: product.id
          }
        });

        return reply.status(200).send({ priceLogs: productPriceLogs });
      } else {
        return reply.status(404).send({ message: "Product not found." });
      }
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });
}
