import { IRepository } from "../repository";
import { database } from "../../config/database";
import { Decimal } from "@prisma/client/runtime/library";

interface ParamsSchema {
  productId: string;
  stockId: string;
  quantity: number;
}

interface ReturnSchema {
  productId: string;
  stockId: string;
  quantity: number;
  addedAt: Date;
}

export class PostgresAddProductToStockRepository implements IRepository {
  async execute({ productId, stockId, quantity }: ParamsSchema): Promise<ReturnSchema | null> {
    const productAddedToStock = await database.stockProducts.create({
      data: {
        stockId,
        productId,
        quantity
      }
    });

    return productAddedToStock;
  }
}
