import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  userId: string;
  stockId: string;
}

interface ReturnSchema {
  products: {
    quantity: number;
    addedAt: Date;
    product: {
        id: string;
        name: string;
        minQuantity: number;
        unitType: {
            name: string;
        } | null;
        type: {
            name: string;
        };
    };
  }[];
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class PostgresGetStockByIndexRepository implements IRepository {
  async execute({ userId, stockId }: ParamsSchema): Promise<ReturnSchema | null> {
    const unitType = await database.stock.findUnique({
      where: {
        id: stockId,
        userId
      },
      include: {
        products: {
          select: {
            product: {
              select: {
                id: true,
                name: true,
                type: {
                  select: {
                    name: true
                  }
                },
                unitType: {
                  select: {
                    name: true
                  }
                },
                minQuantity: true
              }
            },
            quantity:true,
            addedAt: true
          }
        }
      }
    });

    return unitType;
  }
}
