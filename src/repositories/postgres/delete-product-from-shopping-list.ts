import { IRepository } from "../repository";
import { database } from "../../config/database";
import { Decimal } from "@prisma/client/runtime/library";

interface ParamsSchema {
  productId: string;
  shoppingListId: string;
  userId: string;
}

interface ReturnSchema {
  productId: string;
  shoppingListId: string;
  quantityBought: number | null;
  pricePaid: Decimal | null;
}

export class PostgresDeleteProductFromShoppingListByIndexRepository implements IRepository {
  async execute({ productId, shoppingListId, userId }: ParamsSchema): Promise<ReturnSchema | null> {
    const shoppingList = await database.shoppingListProducts.delete({
      where: {
        productId_shoppingListId: {
          productId,
          shoppingListId
        },
        shoppingList: {
          userId
        },
        product: {
          userId
        }
      }
    });

    return shoppingList;
  }
}