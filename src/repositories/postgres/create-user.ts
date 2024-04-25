import { IRepository } from "../repository";
import { database } from "../../config/database";
import { Decimal } from "@prisma/client/runtime/library";

interface ParamsSchema {
  name: string;
  email: string;
}

interface ReturnSchema {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class PostgresGetShoppingListProductsRepository implements IRepository {
  async execute({ name, email }: ParamsSchema): Promise<ReturnSchema | null> {
    const newUser = await database.user.create({
      data: {
        name,
        email
      }
    });

    return newUser;
  }
}
