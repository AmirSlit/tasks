import express from "express";
import authController from "./module/auth/auth.controller.js";
import userController from "./module/user/user.controller.js";
import noteController from "./module/note/note.controller.js";
import { golbalErrorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/notFound.middleware.js";
import { port } from "./config/config.js";
import testDBConnection from "./DB/conniction.db.js";

async function bootstarp() {
  const app = express();

  app.use(express.json());
  app.use("/auth", authController);
  app.use("/user", userController);
  app.use("/note", noteController);

  await testDBConnection(app);
  app.use("{/*dummy}", notFoundMiddleware);

  app.use(golbalErrorMiddleware);
}
bootstarp();
