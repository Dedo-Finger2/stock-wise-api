import { env } from "./config/env";
import { app } from "./config/app";

import { login } from "./routes/login";
import { registerUser } from "./routes/register-user";
import { verifyToken } from "./routes/verify-token";

import { createStock } from "./routes/create-stock";
import { getStock } from "./routes/get-stock";
import { addProductToStock } from "./routes/add-product-to-stock";
import { removeProductFromStock } from "./routes/remove-product-from-stock";
import { deleteProductFromStock } from "./routes/delete-product-from-stock";

import { createProductType } from "./routes/create-product-type";

import { createUnitType } from "./routes/create-unit-type";

import { createProduct } from "./routes/create-product";
import { updateProduct } from "./routes/update-product";
import { getProductPriceLogs } from "./routes/check-product-price-log";

app.register(login);
app.register(registerUser);
app.register(verifyToken);
app.register(createStock);
app.register(getStock);
app.register(createProductType);
app.register(createUnitType);
app.register(createProduct);
app.register(updateProduct);
app.register(getProductPriceLogs);
app.register(addProductToStock);
app.register(removeProductFromStock);
app.register(deleteProductFromStock);

app.listen({ port: env.PORT }).then(() => {
  console.log(`Running... http://localhost:${env.PORT}/`);
});
