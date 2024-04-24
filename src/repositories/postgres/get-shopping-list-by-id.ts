import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  id: string,
  userId: string
}

interface ReturnSchema {
  id: string,
  userId: string,
  completedAt: Date | null,
  createdAt: Date,
  updatedAt: Date | null
}

export class PostgresGetShoppingListByIdRepository implements IRepository {
  async execute({ id, userId }: ParamsSchema): Promise<ReturnSchema | null> {
    const shoppingList = await database.shoppingList.findUnique({
      where: {
        id,
        userId
      }
    });

    return shoppingList;
  }
}
