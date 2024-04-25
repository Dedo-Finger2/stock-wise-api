import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  userId: string;
}

interface ReturnSchema {
  id: string;
  userId: string;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export class PostgresCreateShoppingListRepository implements IRepository {
  async execute({ userId }: ParamsSchema): Promise<ReturnSchema | null> {
    const shoppingList = await database.shoppingList.create({
      data: {
        userId
      }
    });

    return shoppingList;
  }
}
