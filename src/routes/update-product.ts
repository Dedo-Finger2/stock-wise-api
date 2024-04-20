import { auth } from "./middleware/auth";
import { database } from "../config/database";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function updateProduct(app: FastifyInstance) {
  app.put("/api/products/:id", { preHandler: auth }, async (request, reply) => {
    const updateProductBodySchema = z.object({
      name: z.string(),
      description: z.string().optional().nullable(),
      minQuantity: z.coerce.number().positive(),
      productTypeId: z.string().uuid(),
      unitTypeId: z.string().uuid().optional().nullable()
    });
    const requestCookiesSchema = z.object({
      userId: z.string().uuid()
    });
    const requestParamsSchema = z.object({
      id: z.string().uuid()
    });

    const { name, description, minQuantity, productTypeId, unitTypeId } = updateProductBodySchema.parse(request.body);
    const { userId } = requestCookiesSchema.parse(request.cookies);
    const { id } = requestParamsSchema.parse(request.params);

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

      const isUserTheProductOwner = doesProductAlreadyExists?.id !== id && doesProductAlreadyExists?.userId === userId;

      if (doesProductAlreadyExists && isUserTheProductOwner) {
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

      const updatedProduct = await database.product.update({
        where: {
          id,
          userId
        },
        data: {
          name: formatedNormilzedName,
          minQuantity,
          description,
          productTypeId,
          unitTypeId
        }
      });

      return reply.status(200).send({ productId: updatedProduct.id });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });
}
