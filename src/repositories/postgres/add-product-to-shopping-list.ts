import { IRepository } from "../repository";
import { database } from "../../config/database";
import { Decimal } from "@prisma/client/runtime/library";

interface ParamsSchema {
  productId: string;
  shoppingListId: string;
}

interface ReturnSchema {
  productId: string;
  shoppingListId: string;
  quantityBought: number | null;
  pricePaid: Decimal | null;
}

export class PostgresAddProductToShoppingListRepository implements IRepository {
  async execute({ productId, shoppingListId }: ParamsSchema): Promise<ReturnSchema | null> {
    const productAddedToShoppingList = await database.shoppingListProducts.create({
      data: {
        shoppingListId,
        productId
      }
    });

    return productAddedToShoppingList;
  }
}
