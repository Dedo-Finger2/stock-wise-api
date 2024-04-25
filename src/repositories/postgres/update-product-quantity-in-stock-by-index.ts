import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  productId: string;
  stockId: string;
  userId: string;
  quantity: number;
}

interface ReturnSchema {
  productId: string;
  stockId: string;
  quantity: number;
  addedAt: Date;
}

export class PostgresUpdateProductQuantityInStockByIndexRepository implements IRepository {
  async execute({ productId, quantity, stockId, userId }: ParamsSchema): Promise<ReturnSchema | null> {
    const updatedProductInStock = await database.stockProducts.update({
      where: {
        productId_stockId: {
          productId,
          stockId
        },
        stock: {
          userId
        },
        product: {
          userId
        }
      },
      data: {
        quantity
      }
    });

    return updatedProductInStock;
  }
}
