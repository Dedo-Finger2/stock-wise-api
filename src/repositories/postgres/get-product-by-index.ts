import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  productId: string;
  userId: string;
}

interface ReturnSchema {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  minQuantity: number;
  productTypeId: string;
  unitTypeId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export class PostgresGetProductByIndexRepository implements IRepository {
  async execute({ productId, userId }: ParamsSchema): Promise<ReturnSchema | null> {
    const product = await database.product.findUnique({
      where: {
        id: productId,
        userId
      }
    });

    return product;
  }
}
