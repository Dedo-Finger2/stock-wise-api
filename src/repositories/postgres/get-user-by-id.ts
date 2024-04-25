import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  userId: string
}

interface ReturnSchema {
  id: string,
  name: string,
  email: string,
  createdAt: Date,
  updatedAt: Date | null,
}

export class PostgresGetUserByIdRepository implements IRepository {
  async execute({ userId }: ParamsSchema): Promise<ReturnSchema | null> {
    const user = await database.user.findUnique({
      where: {
        id: userId
      }
    });

    return user;
  }
}
