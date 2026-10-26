import express from "express";
import authController from "./module/auth/auth.controller.js";
import userController from "./module/user/user.controller.js";
import { globalErrorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/notFound.middleware.js";
import testDBconnection from "./DB/connection.db.js";
import { sendMail } from "./common/utils/email/email.service.js";

async function bootstrap() {
  const app = express();

  app.use(express.json());
  app.use("/auth", authController);
  app.use("/user", userController);

  // await sendMail({
  //   to: "xjthyexsstqkmhhmzm@jbsze.net",
  //   subject: "this for test",
  //   html: "<h1>Hello</h1>",
  // });
  await testDBconnection(app);
  app.use("{/*dummy}", notFoundMiddleware);

  app.use(globalErrorMiddleware);
}
bootstrap();
