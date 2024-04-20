import { database } from "../config/database";
import { FastifyInstance } from "fastify";
import { z } from "zod";

type DecodedToken = {
  userId: string
}

export async function verifyToken(app: FastifyInstance) {
  app.get("/api/verify-token", async (request, reply) => {
    const verifyTokenQuerySchema = z.object({
      token: z.string()
    });

    const { token } = verifyTokenQuerySchema.parse(request.query);

    try {
      const { userId }: DecodedToken = app.jwt.verify(token);

      const user = await database.user.findUnique({
        where: {
          id: userId
        }
      });

      if (user) {
        reply.setCookie("userId", user.id, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7 // 7 Days
        });

        return reply.status(200).send({ message: "Authenticated." });
      } else {
        return reply.status(400).send({ message: "User Not FOund." });
      }

    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });
}
