import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  shoppingListid: string;
  userId: string;
}

interface ReturnSchema {
  id: string;
  userId: string;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export class PostgresGetProductInShoppingListRepository implements IRepository {
  async execute({ shoppingListid, userId }: ParamsSchema): Promise<ReturnSchema | null> {
    const updatedShoppingList = await database.shoppingList.update({
      where: {
        id: shoppingListid,
        userId
      },
      data: {
        updatedAt: new Date()
      }
    });

    return updatedShoppingList;
  }
}
