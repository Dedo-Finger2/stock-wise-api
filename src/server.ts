import { env } from "./config/env";
import { app } from "./config/app";

import { login } from "./routes/login";
import { registerUser } from "./routes/register-user";
import { verifyToken } from "./routes/verify-token";

import { createStock } from "./routes/create-stock";
import { getStock } from "./routes/get-stock";

import { createProductType } from "./routes/create-product-type";

import { createUnitType } from "./routes/create-unit-type";

import { createProduct } from "./routes/create-product";

app.register(login);
app.register(registerUser);
app.register(verifyToken);
app.register(createStock);
app.register(getStock);
app.register(createProductType);
app.register(createUnitType);
app.register(createProduct);

app.listen({ port: env.PORT }).then(() => {
  console.log(`Running... http://localhost:${env.PORT}/`);
});
