import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  userId: string;
  normalizedName: string;
}

interface ReturnSchema {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class PostgresCreateProductTypeRepository implements IRepository {
  async execute({ userId, normalizedName }: ParamsSchema): Promise<ReturnSchema | null> {
    const shoppingList = await database.productType.create({
      data: {
        name: normalizedName,
        userId
      }
    });

    return shoppingList;
  }
}
