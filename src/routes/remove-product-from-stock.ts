import { auth } from "./middleware/auth";
import { database } from "../config/database";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function removeProductFromStock(app: FastifyInstance) {
  app.patch("/api/stocks/:id/remove-product", { preHandler: auth }, async (request, reply) => {
    const requestBodySchema = z.object({
      productId: z.string().uuid(),
      quantity: z.coerce.number().positive().min(0.5).optional().default(1)
    });
    const requestParamsSchema = z.object({
      id: z.string().uuid()
    });
    const requestCookiesSchema = z.object({
      userId: z.string().uuid()
    });

    const { userId } = requestCookiesSchema.parse(request.cookies);
    const { productId, quantity } = requestBodySchema.parse(request.body);
    const { id } = requestParamsSchema.parse(request.params);

    try {
      const stock = await database.stock.findUnique({
        where: {
          id,
          userId
        }
      });

      const stockDoesNotExists = !stock;

      if (stockDoesNotExists) {
        return reply.status(404).send({ message: "Could not find any stock." });
      }

      const isProductInStock = await database.stockProducts.findUnique({
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

      const productIsNotInStock = !isProductInStock;

      if (productIsNotInStock) {
        return reply.status(400).send({ message: "Product is not in the stock." });
      }

      const isRemovingQuantityGreaterThanProductInStockQuantity = isProductInStock.quantity < quantity ? true : false;
      const newProductQuantity = isProductInStock.quantity - quantity;

      if (isRemovingQuantityGreaterThanProductInStockQuantity) {
        return reply.status(400).send({ message: "The given number suprass the quantity in stock for this product." });
      }

      await database.stockProducts.update({
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
        },
        data: {
          quantity: newProductQuantity
        }
      });


      await database.stock.update({
        where: {
          id,
          userId
        },
        data: {
          updatedAt: new Date()
        }
      });

      return reply.status(200).send({ message: "Product removed from stock." });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });
}
