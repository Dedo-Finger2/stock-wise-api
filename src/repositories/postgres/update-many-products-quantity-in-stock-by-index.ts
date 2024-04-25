import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  productId: string;
  stockId: string;
  updatedQuantity: number;
}

interface ReturnSchema {
  productId: string;
  stockId: string;
  quantity: number;
  addedAt: Date;
}

export class PostgresGetProductCurrentQuantityInStockByIndexRepository implements IRepository {
  async execute({ productId, stockId, updatedQuantity }: ParamsSchema): Promise<ReturnSchema | null> {
    const productIdInStock = await database.stockProducts.update({
      where: {
        productId_stockId: {
          productId,
          stockId
        }
      },
      data: {
        quantity: updatedQuantity
      }
    });

    return productIdInStock;
  }
}
