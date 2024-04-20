import { FastifyReply, FastifyRequest } from "fastify";

export async function auth(request: FastifyRequest, reply: FastifyReply) {
  try {
    if (!request?.cookies?.userId) {
      return reply.status(401).send({ message: "Not authenticated." });
    }
  } catch (error) {
    return reply.status(500).send({ message: "Internal Server Error." });
  }
}
