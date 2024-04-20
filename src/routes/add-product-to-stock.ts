import { auth } from "./middleware/auth";
import { database } from "../config/database";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function addProductToStock(app: FastifyInstance) {
  app.post("/api/stocks/:id/add-product", { preHandler: auth }, async (request, reply) => {
    const requestBodySchema = z.object({
      productId: z.string().uuid(),
      quantity: z.coerce.number().positive().min(1)
    });
    const requestParamsSchema = z.object({
      id: z.string().uuid()
    });
    const requestCookiesSchema = z.object({
      userId: z.string().uuid()
    });

    const { productId, quantity } = requestBodySchema.parse(request.body);
    const { userId } = requestCookiesSchema.parse(request.cookies);
    const { id } = requestParamsSchema.parse(request.params);

    try {
      const stock = await database.stock.findUnique({
        where: {
          id
        }
      });

      const stockDoesNotExists = !stock;

      if (stockDoesNotExists) {
        return reply.status(404).send({ message: "Could not find any stock." });
      }

      const isProductAlreadyInStock = await database.stockProducts.findUnique({
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

      if (isProductAlreadyInStock) {
        const newProductQuantity = isProductAlreadyInStock.quantity + quantity;

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

        return reply.status(200).send({ message: "Product quantity updated." });
      } else {
        await database.stockProducts.create({
          data: {
            stockId: id,
            productId,
            quantity
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

        return reply.status(201).send({ message: "Product added to stock." });
      }
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });
}
