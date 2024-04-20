import { database } from "../config/database";
import { FastifyInstance } from "fastify";
import { MailrapMailService } from "../services/mailtrap-mail-service";
import { z } from "zod";

export async function registerUser(app: FastifyInstance) {
  app.post("/api/users/register", async (request, reply) => {
    const userRegisterBodySchema = z.object({
      name: z.string(),
      email: z.string().email()
    });

    const { name, email } = userRegisterBodySchema.parse(request.body);

    try {
      const isUserAlreadyRegistered = await database.user.findUnique({
        where: {
          email
        }
      });

      if (isUserAlreadyRegistered) {
        return reply.status(400).send({ message: "Email already registered, try login." });
      }

      const newUser = await database.user.create({
        data: {
          name,
          email
        }
      });

      const token = app.jwt.sign(
        { userId: newUser.id },
        {
          expiresIn: "1h"
        }
      );

      await new MailrapMailService().sendMessage({
        to: {
          name: newUser.name,
          address: newUser.email
        },
        from: {
          name: "Testing group",
          address: "stockwisecompanty@stock.com"
        },
        subject: "Validation link",
        html: `<a href='${token}'>Click here</a>`
      });

      return reply.status(200).send({ message: "Check your e-mail inbox." });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Internal Server Error." });
    }
  });
}
