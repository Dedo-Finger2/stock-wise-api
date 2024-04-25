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

export class PostgresRemoveProductFromShoppingListByIndexRepository implements IRepository {
  async execute({ productId, shoppingListId, userId }: ParamsSchema): Promise<ReturnSchema | null> {
    const removedProduct = await database.shoppingListProducts.delete({
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

    return removedProduct;
  }
}
