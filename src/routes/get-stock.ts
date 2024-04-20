import { auth } from "./middleware/auth";
import { database } from "../config/database";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function getStock(app: FastifyInstance) {
  app.get("/api/stocks/:id", { preHandler: auth }, async(request, reply) => {
    const getStockRequestParamsSchema = z.object({
      id: z.string().uuid()
    });

    const requestCookiesSchema = z.object({
      userId: z.string().uuid()
    });

    const { id } = getStockRequestParamsSchema.parse(request.params);
    const { userId } = requestCookiesSchema.parse(request.cookies);

    try {
      const stock = await database.stock.findUnique({
        where: {
          id,
          userId
        },
        include: {
          products: {
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
              quantity:true,
              addedAt: true
            }
          }
        }
      });

      const formatedStockObject = {
        ...stock,
        products: stock?.products.map((product) => {
          return {
            id: product.product.id,
            name: product.product.name,
            type: product.product.type.name,
            unitType: product.product.unitType?.name,
            minQuantity: product.product.minQuantity,
            quantityInStock: product.quantity,
            addedAt: product.addedAt
          };
        })
      };

      if (stock) {
        return reply.status(200).send({ stock: formatedStockObject });
      } else {
        return reply.status(400).send({ message: "User does not have a stock yet or is trying to access a stock that does not own." });
      }

    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });
}
