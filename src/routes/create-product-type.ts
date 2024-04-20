import { auth } from "./middleware/auth";
import { database } from "../config/database";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function createProductType(app: FastifyInstance) {
  app.post("/api/product-types/", { preHandler: auth}, async (request, reply) => {
    const createProductTypeBodySchema = z.object({
      name: z.string()
    });
    const requestCookiesSchema = z.object({
      userId: z.string().uuid()
    });

    const { name } = createProductTypeBodySchema.parse(request.body);
    const { userId } = requestCookiesSchema.parse(request.cookies);

    try {
      const normalizedName = name.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replaceAll(" ", "-")
        .replaceAll(".", "")
        .replaceAll("~", "");

      const doesProductTypeAlreadyExistsWithProviedUserId = await database.productType.findUnique({
        where: {
          userId_name: {
            userId,
            name: normalizedName
          }
        }
      });

      if (doesProductTypeAlreadyExistsWithProviedUserId) {
        return reply.status(400).send({ message: `There is a Product Type named ${normalizedName} already registered.` });
      }

      const newProductType = await database.productType.create({
        data: {
          name: normalizedName,
          userId
        }
      });

      return reply.status(201).send({ productTypeId: newProductType.id });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });
}
