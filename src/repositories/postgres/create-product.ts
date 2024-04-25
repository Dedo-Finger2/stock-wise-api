import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  userId: string;
  formattedNormalizedName: string;
  minQuantity: number;
  description: string;
  productTypeId: string;
  unitTypeId: string
}

interface ReturnSchema {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class PostgresCreateProductRepository implements IRepository {
  async execute({ userId, description, formattedNormalizedName, minQuantity, productTypeId, unitTypeId }: ParamsSchema): Promise<ReturnSchema | null> {
    const newProduct = await database.product.create({
      data: {
        userId,
        name: formattedNormalizedName,
        minQuantity,
        description,
        productTypeId,
        unitTypeId
      }
    });

    return newProduct;
  }
}
