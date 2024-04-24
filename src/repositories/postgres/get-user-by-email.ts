import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  email: string
}

interface ReturnSchema {
  id: string,
  name: string,
  email: string,
  createdAt: Date,
  updatedAt: Date | null,
}

export class PostgresGetUserByEmailRepository implements IRepository {
  async execute({ email }: ParamsSchema): Promise<ReturnSchema | null> {
    const user = await database.user.findUnique({
      where: {
        email
      }
    });

    return user;
  }
}
