import { IRepository } from "../repository";
import { database } from "../../config/database";
import { Prisma } from "@prisma/client";

interface ParamsSchema {
  shoppingListId: string;
  productId: string;
}

export class PostgresAddManyProductsToShoppingListRepository implements IRepository {
  async execute(newShoppingList: Array<ParamsSchema>): Promise<Prisma.BatchPayload | null> {
    const createdProductsInStock = await database.shoppingListProducts.createMany({
      data: newShoppingList.map((param) => { return { shoppingListId: param.shoppingListId, productId: param.productId }; })
    });

    return createdProductsInStock;
  }
}
