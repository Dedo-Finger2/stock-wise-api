import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  shoppingListId: string;
}

interface ReturnSchema {
  id: string;
  userId: string;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export class PostgresCompleteShoppingListByIdRepository implements IRepository {
  async execute({ shoppingListId }: ParamsSchema): Promise<ReturnSchema | null> {
    const updatedShoppingList = await database.shoppingList.update({
      where: {
        id: shoppingListId
      },
      data: {
        updatedAt: new Date(),
        completedAt: new Date()
      }
    });

    return updatedShoppingList;
  }
}
