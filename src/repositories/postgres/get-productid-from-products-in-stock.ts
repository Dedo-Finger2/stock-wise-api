import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ReturnSchema {
  productId: string;
}

export class PostgresGetStockByIdRepository implements IRepository {
  async execute(): Promise<Array<ReturnSchema> | null> {
    const productIdInStock = await database.stockProducts.findMany({
      select: {
        productId: true
      }
    });

    return productIdInStock;
  }
}
