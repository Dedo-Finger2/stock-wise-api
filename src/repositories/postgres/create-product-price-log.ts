import { IRepository } from "../repository";
import { database } from "../../config/database";
import { Prisma } from "@prisma/client";

interface ParamsSchema {
  productId: string;
  quantityBought: number;
  pricePaid?: number | undefined;
}

export class PostgresCreateProductPriceLogRepository implements IRepository {
  async execute(params: Array<ParamsSchema>): Promise<Prisma.BatchPayload | null> {
    const productPriceLog = await database.productPriceLog.createMany({
      // TODO: Problema de tipagem
      data: params.map((product) => { return { productId: product.productId, price: product!.pricePaid }; })
    });

    return productPriceLog;
  }
}
