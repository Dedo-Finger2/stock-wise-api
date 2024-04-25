import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  productId: string;
  stockId: string;
}

interface ReturnSchema {
  quantity: number;
}

export class PostgresGetProductCurrentQuantityInStockByIndexRepository implements IRepository {
  async execute({ productId, stockId }: ParamsSchema): Promise<ReturnSchema | null> {
    const productIdInStock = await database.stockProducts.findUnique({
      where: {
        productId_stockId: {
          productId,
          stockId
        }
      },
      select: {
        quantity: true
      }
    });

    return productIdInStock;
  }
}
