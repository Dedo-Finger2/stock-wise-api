import { IRepository } from "../repository";
import { database } from "../../config/database";
import { Decimal } from "@prisma/client/runtime/library";

interface ParamsSchema {
  productId: string;
}

interface ReturnSchema {
  createdAt: Date;
  price: Decimal;
}

export class PostgresGetAllProductPriceLogByIdRepository implements IRepository {
  async execute({ productId }: ParamsSchema): Promise<Array<ReturnSchema> | null> {
    const productAddedToStock = await database.productPriceLog.findMany({
      where: {
        productId
      },
      orderBy: {
        createdAt: "desc"
      },
      select: {
        price: true,
        createdAt: true
      }
    });

    return productAddedToStock;
  }
}
