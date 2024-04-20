import { auth } from "./middleware/auth";
import { database } from "../config/database";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function createUnitType(app: FastifyInstance) {
  app.post("/api/unit-types/", { preHandler: auth }, async (request, reply) => {
    const createUnitTypeBodySchema = z.object({
      name: z.string()
    });
    const requestCookiesSchema = z.object({
      userId: z.string().uuid()
    });

    const { name } = createUnitTypeBodySchema.parse(request.body);
    const { userId } = requestCookiesSchema.parse(request.cookies);

    try {
      const normalizedName = name.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim()
        .replaceAll(" ", "-")
        .replaceAll(".", "")
        .replaceAll("~", "");

      const doesUnitTypeAlreadyExistsWithProviedUserId = await database.unitType.findUnique({
        where: {
          userId_name: {
            userId,
            name: normalizedName
          }
        }
      });

      if (doesUnitTypeAlreadyExistsWithProviedUserId) {
        return reply.status(400).send({ message: `There is a Unit Type named ${normalizedName} already registered.` });
      }

      const newUnitType = await database.unitType.create({
        data: {
          name: normalizedName,
          userId
        }
      });

      return reply.status(201).send({ unitTypeId: newUnitType.id });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });
}
