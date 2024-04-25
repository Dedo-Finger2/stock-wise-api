import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  productId: string;
  stockId: string;
  userId: string;
}

interface ReturnSchema {
  productId: string;
  stockId: string;
  quantity: number;
  addedAt: Date;
}

export class PostgresGetProductInStockByIndexRepository implements IRepository {
  async execute({ productId, stockId, userId }: ParamsSchema): Promise<ReturnSchema | null> {
    const productInStock = await database.stockProducts.findUnique({
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
      }
    });

    return productInStock;
  }
}
