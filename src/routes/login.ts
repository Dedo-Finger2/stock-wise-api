import { database } from "../config/database";
import { FastifyInstance } from "fastify";
import { MailrapMailService } from "../services/mailtrap-mail-service";
import { z } from "zod";

export async function login(app: FastifyInstance) {
  app.post("/api/login", async (request, reply) => {
    const loginBodySchema = z.object({
      email: z.string().email()
    });

    const { email } = loginBodySchema.parse(request.body);

    try {
      const user = await database.user.findUnique({
        where: {
          email
        }
      });

      if (user) {
        const token = app.jwt.sign(
          { userId: user.id },
          {
            expiresIn: "1h"
          }
        );

        await new MailrapMailService().sendMessage({
          to: {
            name: user.name,
            address: user.email
          },
          from: {
            name: "Testing group",
            address: "stockwisecompanty@stock.com"
          },
          subject: "Validation link",
          html: `<a href='http://localhost:3333/api/verify-token?token=${token}' target='_blank'>Click here</a>`
        });

        return reply.status(200).send({ message: "Check your e-mail inbox." });
      } else {
        return reply.status(400).send({ message: "Email not registred. Try and register." });
      }
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });
}