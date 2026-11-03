import express from "express";
import authController from "./module/auth/auth.controller.js";
import userController from "./module/user/user.controller.js";
import messageController from "./module/message/message.controller.js";
import { globalErrorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/notFound.middleware.js";
import testDBconnection from "./DB/connection.db.js";

async function bootstrap() {
  const app = express();

  app.use(express.json());
  app.use("/assets", express.static("./assets"));
  app.use("/auth", authController);
  app.use("/user", userController);
  app.use("/message", messageController);

  await testDBconnection(app);
  app.use("{/*dummy}", notFoundMiddleware);

  app.use(globalErrorMiddleware);
}
bootstrap();
