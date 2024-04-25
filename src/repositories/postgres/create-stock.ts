import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  userId: string;
}

interface ReturnSchema {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class PostgresCreateStockRepository implements IRepository {
  async execute({ userId }: ParamsSchema): Promise<ReturnSchema | null> {
    const newProduct = await database.stock.create({
      data: {
        userId
      }
    });

    return newProduct;
  }
}
