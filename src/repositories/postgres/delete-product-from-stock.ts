import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  userId: string;
  stockId: string;
  productId: string;
}

interface ReturnSchema {
  productId: string;
  stockId: string;
  quantity: number;
  addedAt: Date;
}

export class PostgresDeleteProductFromStockRepository implements IRepository {
  async execute({ userId, productId, stockId }: ParamsSchema): Promise<ReturnSchema | null> {
    const unitType = await database.stockProducts.delete({
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

    return unitType;
  }
}
