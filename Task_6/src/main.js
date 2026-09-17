import express from "express";
import authController from "./module/auth/auth.controller.js";
import booksController from "./module/books/books.controller.js";
import authorsController from "./module/authors/author.controller.js";
import logsController from "./module/logs/logs.controller.js";
import { golbalErrorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/notFound.middleware.js";
import { port } from "./config/config.js";
import { testDBConnection } from "./DB/conniction.db.js";

async function bootstarp() {
  const app = express();

  app.use(express.json());
  app.use("/user", authController);
  app.use("/collection", booksController);
  app.use("/collection", authorsController);
  app.use("/collection", logsController);

  await testDBConnection(app);

  app.use("{/*dummy}", notFoundMiddleware);
  app.use(golbalErrorMiddleware);
}
bootstarp();
