import express from "express";
import authController from "./module/auth/auth.controller.js";
import userController from "./module/user/user.controller.js";
import { globalErrorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/notFound.middleware.js";
import { port } from "./config/config.js";
import testDBconnection from "./DB/connection.db.js";

async function bootstrap() {
  const app = express();

  app.use(express.json());
  app.use("/auth", authController);
  app.use("/user", userController);

  await testDBconnection(app);

  app.use("{/*dummy}", notFoundMiddleware);

  app.use(globalErrorMiddleware);
}
bootstrap();
