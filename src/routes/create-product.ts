import { auth } from "./middleware/auth";
import { database } from "../config/database";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function createProduct(app: FastifyInstance) {
  app.post("/api/products/", { preHandler: auth }, async (request, reply) => {
    const createProductBodySchema = z.object({
      name: z.string(),
      description: z.string().optional().nullable(),
      minQuantity: z.coerce.number().positive(),
      productTypeId: z.string().uuid(),
      unitTypeId: z.string().uuid().optional().nullable()
    });
    const requestCookiesSchema = z.object({
      userId: z.string().uuid()
    });

    const { name, description, minQuantity, productTypeId, unitTypeId } = createProductBodySchema.parse(request.body);
    const { userId } = requestCookiesSchema.parse(request.cookies);

    try {
      const normalizedName = name.toLowerCase()
      .trim()
      .replace(/[\u0300-\u036f\\~\\`\\'\\'\\´\\!\\?\\,\\.]/g, "")
      .split(" ");

      const formatedNormilzedName = normalizedName.map((word) => {
        const isWordALinguisticArticle = word.length === 1;

        return isWordALinguisticArticle ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1);
      }).join(" ");

      const doesProductAlreadyExists = await database.product.findUnique({
        where: {
          name_userId: {
            name: formatedNormilzedName,
            userId
          }
        }
      });

      if (doesProductAlreadyExists) {
        return reply.status(400).send({ message: `A Product with name ${formatedNormilzedName} is already registered.` });
      }

      const isProductTypeIdRegistered = await database.productType.findUnique({
        where: {
          id: productTypeId
        }
      });

      if (!isProductTypeIdRegistered) {
        return reply.status(400).send({ message: "Product Type does not exists." });
      }

      if (unitTypeId) {
        const isUnitTypeIdRegistered = await database.unitType.findUnique({
          where: {
            id: unitTypeId
          }
        });

        if (!isUnitTypeIdRegistered) {
          return reply.status(400).send({ message: "Unit Type does not exists." });
        }
      }

      const newProduct = await database.product.create({
        data: {
          userId,
          name,
          minQuantity,
          description,
          productTypeId,
          unitTypeId
        }
      });

      return reply.status(201).send({ productId: newProduct.id });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });
}
