import { env } from "./config/env";
import { app } from "./config/app";

app.listen({ port: env.PORT }).then(() => {
  console.log(`Running... http://localhost:${env.PORT}/`);
});
