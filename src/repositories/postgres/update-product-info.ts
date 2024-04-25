import { IRepository } from "../repository";
import { database } from "../../config/database";
import { Decimal } from "@prisma/client/runtime/library";

interface ParamsSchema {
  productId: string;
  userId: string;
  formattedNormalizedName: string;
  minQuantity: number;
  description: string;
  productTypeId: string;
  unitTypeId: string;
}

interface ReturnSchema {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  minQuantity: number;
  productTypeId: string;
  unitTypeId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export class PostgresRemoveProductFromShoppingListByIndexRepository implements IRepository {
  async execute({ productId, description, formattedNormalizedName, minQuantity, productTypeId, unitTypeId, userId }: ParamsSchema): Promise<ReturnSchema | null> {
    const updatedProduct = await database.product.update({
      where: {
        id: productId,
        userId
      },
      data: {
        name: formattedNormalizedName,
        minQuantity,
        description,
        productTypeId,
        unitTypeId
      }
    });

    return updatedProduct;
  }
}
