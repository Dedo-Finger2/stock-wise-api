import { auth } from "./middleware/auth";
import { database } from "../config/database";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function completeShoppingList(app: FastifyInstance) {
  app.patch("/api/shopping-lists/:id/complete", { preHandler: auth }, async (request, reply) => {
    const requestBodySchema = z.object({
      products: z.array(z.object({
        productId: z.string().uuid(),
        quantityBought: z.coerce.number().positive().min(1),
        pricePaid: z.coerce.number().positive().optional()
      }))
    });
    const requestParamsSchema = z.object({
      id: z.string().uuid()
    });
    const requestCookiesSchema = z.object({
      userId: z.string().uuid()
    });

    const { userId } = requestCookiesSchema.parse(request.cookies);
    const { id } = requestParamsSchema.parse(request.params);
    const { products } = requestBodySchema.parse(request.body);

    try {
      const shoppingList = await database.shoppingList.findUnique({
        where: {
          id
        }
      });

      const shoppingDoesNotExists = !shoppingList;
      const isShoppingListCompleted = shoppingList?.completedAt ? true : false;

      if (isShoppingListCompleted) {
        return reply.status(400).send({ message: "This shopping list is already completed." });
      }

      if (shoppingDoesNotExists) {
        return reply.status(400).send({ message: "Shopping list does not exist." });
      }

      await database.shoppingList.update({
        where: {
          id
        },
        data: {
          // Atualizar o campo updated at da shopping list
          updatedAt: new Date(),
          // Marcar shopping list como comcluída
          completedAt: new Date()
        }
      });

      const productsWithPricePaidArray = products.filter((product) => product.pricePaid);

      // Atualizar preço dos produtos que tiveram preço dito
      // TODO: Probleminha de tipagem que pode ser concertado no futuro
      if (productsWithPricePaidArray) {
        await database.productPriceLog.createMany({
          data: productsWithPricePaidArray.map((product) => { return { productId: product.productId, price: product!.pricePaid }; })
        });
      }

      const stock = await database.stock.findUnique({
        where: {
          userId
        }
      });

      const stockDoestNotExists = !stock;

      if (stockDoestNotExists) {
        return reply.status(400).send({ message: "User does not have a stock yet created." });
      }

      const userStockProductsId = await database.stockProducts.findMany({
        select: {
          productId: true
        }
      });

      const userStockProductsIdArray = userStockProductsId.map((product) => { return product.productId; });
      const productsThatAlreadyInStock = products.filter((product) =>  userStockProductsIdArray.includes(product.productId));
      const productsNotInStock = products.filter((product) => !userStockProductsIdArray.includes(product.productId));

      // Atualizar o estoque do usuário adicionando novos valores aos produtos que já existem
      if (productsThatAlreadyInStock) {
        const updates = productsThatAlreadyInStock.map(async (product) => {
          const currentQuantity = await database.stockProducts.findUnique({
            where: {
              productId_stockId: {
                productId: product.productId,
                stockId: stock.id
              }
            },
            select: {
              quantity: true
            }
          });

          return {
            productId: product.productId,
            updatedQuantity: product.quantityBought + currentQuantity!.quantity
          };
        });

        for (const update of updates) {
          await database.stockProducts.update({
            where: {
              productId_stockId: {
                productId: (await update).productId,
                stockId: stock.id
              }
            },
            data: {
              quantity: (await update).updatedQuantity
            }
          });
        }
      }

      // Registrar no estoque os produtos que não existem nele ainda
      if (productsNotInStock) {
        await database.stockProducts.createMany({
          data: productsNotInStock.map((product) => { return { productId: product.productId, quantity: product.quantityBought, stockId: stock.id }; }),
          skipDuplicates: true
        });
      }

      return reply.status(200).send({ message: "Shopping list completed." });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });
}
