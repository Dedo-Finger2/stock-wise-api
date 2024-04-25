import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  userId: string;
  normalizedName: string;
}

interface ReturnSchema {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class PostgresGetUnitTypeByIndexRepository implements IRepository {
  async execute({ userId, normalizedName }: ParamsSchema): Promise<ReturnSchema | null> {
    const unitType = await database.unitType.findUnique({
      where: {
        userId_name: {
          userId,
          name: normalizedName
        }
      }
    });

    return unitType;
  }
}
