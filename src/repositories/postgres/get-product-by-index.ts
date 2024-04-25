import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  userId: string;
  formattedNormalizedName: string;
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
  async execute({ userId, formattedNormalizedName }: ParamsSchema): Promise<ReturnSchema | null> {
    const productType = await database.product.findUnique({
      where: {
        name_userId: {
          name: formattedNormalizedName,
          userId
        }
      }
    });

    return productType;
  }
}
