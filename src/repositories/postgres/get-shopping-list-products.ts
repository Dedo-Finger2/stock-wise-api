import { IRepository } from "../repository";
import { database } from "../../config/database";
import { Decimal } from "@prisma/client/runtime/library";

interface ParamsSchema {
  userId: string;
  shoppingListId: string;
}

interface ReturnSchema {
  product: {
    name: string;
    unitType: {
        name: string;
    } | null;
    stocks: {
        quantity: number;
    }[];
    price: {
        price: Decimal;
    }[];
  };
}

export class PostgresGetShoppingListProductsRepository implements IRepository {
  async execute({ userId, shoppingListId }: ParamsSchema): Promise<Array<ReturnSchema> | null> {
    const unitType = await database.shoppingListProducts.findMany({
      select: {
        product: {
          select: {
            name: true,
            stocks: {
              where: {
                stock: {
                  userId
                }
              },
              select: {
                quantity: true
              }
            },
            unitType: {
              select: {
                name: true
              }
            },
            price: {
              orderBy: {
                createdAt: "desc"
              },
              select: {
                price: true
              }
            }
          }
        }
      },
      where: {
        shoppingListId
      }
    });

    return unitType;
  }
}
