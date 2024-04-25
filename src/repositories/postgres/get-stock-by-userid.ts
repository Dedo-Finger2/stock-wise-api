import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  userId: string
}

interface ReturnSchema {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class PostgresGetStockByUserIdRepository implements IRepository {
  async execute({ userId }: ParamsSchema): Promise<ReturnSchema | null> {
    const stockByUserId = await database.stock.findUnique({
      where: {
        userId
      }
    });

    return stockByUserId;
  }
}
