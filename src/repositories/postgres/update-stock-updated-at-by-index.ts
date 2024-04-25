import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  stockId: string;
  userId: string;
}

interface ReturnSchema {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class PostgresUpdateStockUpdatedAtByIndexRepository implements IRepository {
  async execute({ stockId, userId }: ParamsSchema): Promise<ReturnSchema | null> {
    const updatedStock = await database.stock.update({
      where: {
        id: stockId,
        userId
      },
      data: {
        updatedAt: new Date()
      }
    });

    return updatedStock;
  }
}
