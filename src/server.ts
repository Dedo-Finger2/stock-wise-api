import { env } from "./config/env";
import { app } from "./config/app";

import { login } from "./routes/login";

app.register(login);

app.listen({ port: env.PORT }).then(() => {
  console.log(`Running... http://localhost:${env.PORT}/`);
});
