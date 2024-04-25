import { IRepository } from "../repository";
import { database } from "../../config/database";

interface ParamsSchema {
  unitTypeId: string;
}

interface ReturnSchema {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class PostgresGetUnitTypeByIdRepository implements IRepository {
  async execute({ unitTypeId }: ParamsSchema): Promise<ReturnSchema | null> {
    const productType = await database.unitType.findUnique({
      where: {
        id: unitTypeId
      }
    });

    return productType;
  }
}
