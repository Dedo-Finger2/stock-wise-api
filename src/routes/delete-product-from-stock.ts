import { auth } from "./middleware/auth";
import { database } from "../config/database";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function deleteProductFromStock(app: FastifyInstance) {
  app.delete("/api/stocks/:id/delete-product", { preHandler: auth }, async (request, reply) => {
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
      const productInStock = await database.stockProducts.findUnique({
        where: {
          productId_stockId: {
            productId,
            stockId: id
          },
          stock: {
            userId
          },
          product: {
            userId
          }
        }
      });

      const productIsNotInStock = !productInStock;

      if (productIsNotInStock) {
        return reply.status(400).send({ message: "Product is not in the stock." });
      }

      await database.stockProducts.delete({
        where: {
          productId_stockId: {
            productId,
            stockId: id
          },
          stock: {
            userId
          },
          product: {
            userId
          }
        }
      });

      return reply.status(200).send({ message: "Product deleted from stock." });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });
}
