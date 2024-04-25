import { IRepository } from "../repository";
import { database } from "../../config/database";
import { Prisma } from "@prisma/client";

interface ParamsSchema {
  userId: string;
}

interface ReturnSchema {
  quantity: number;
  product: {
      id: string;
      name: string;
      minQuantity: number;
      unitType: {
          name: string;
      } | null;
      type: {
          name: string;
      };
  };
}

export class PostgresAddManyProductsToStockRepository implements IRepository {
  async execute({ userId }: ParamsSchema): Promise<Array<ReturnSchema> | null> {
    const createdProductsInStock = await database.stockProducts.findMany({
      where: {
        stock: {
          userId
        }
      },
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
        quantity: true
      }
    });

    return createdProductsInStock;
  }
}
