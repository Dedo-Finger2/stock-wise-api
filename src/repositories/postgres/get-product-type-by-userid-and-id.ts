import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  productTypeId: string;
}

interface ReturnSchema {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class PostgresGetProductTypeByIdRepository implements IRepository {
  async execute({ productTypeId }: ParamsSchema): Promise<ReturnSchema | null> {
    const productType = await database.productType.findUnique({
      where: {
        id: productTypeId
      }
    });

    return productType;
  }
}
