import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  stockId: string
}

interface ReturnSchema {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class PostgresGetStockByIdRepository implements IRepository {
  async execute({ stockId }: ParamsSchema): Promise<ReturnSchema | null> {
    const stock = await database.stock.findUnique({
      where: {
        id: stockId
      }
    });

    return stock;
  }
}
