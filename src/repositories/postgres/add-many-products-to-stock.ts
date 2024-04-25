import { IRepository } from "../repository";
import { database } from "../../config/database";
import { Prisma } from "@prisma/client";

interface ParamsSchema {
  productId: string;
  stockId: string;
  quantityBought: number;
}

export class PostgresAddManyProductsToStockRepository implements IRepository {
  async execute(params: Array<ParamsSchema>): Promise<Prisma.BatchPayload | null> {
    const createdProductsInStock = await database.stockProducts.createMany({
      data: params.map((product) => { return { productId: product.productId, quantity: product.quantityBought, stockId: product.stockId }; }),
      skipDuplicates: true
    });

    return createdProductsInStock;
  }
}
