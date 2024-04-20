import { env } from "./config/env";
import { app } from "./config/app";

import { login } from "./routes/login";
import { registerUser } from "./routes/register-user";
import { verifyToken } from "./routes/verify-token";

app.register(login);
app.register(registerUser);
app.register(verifyToken);

app.listen({ port: env.PORT }).then(() => {
  console.log(`Running... http://localhost:${env.PORT}/`);
});
