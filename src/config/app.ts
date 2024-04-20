import fastify from "fastify";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";

const app = fastify();

app.register(jwt, {
  secret: "jhGdoGd-soLh"
});

app.register(cookie, {
  prefix: "/",
  hook: "onRequest"
});

export { app };
