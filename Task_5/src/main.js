import express from "express";
import { syncDB, testDbConnection } from "./DB/connection.db.js";
import { port } from "./config/config.js";
import userModel from "./DB/model/user.model.js";
import postModel from "./DB/model/post.model.js";
import commentModel from "./DB/model/comment.model.js";
import userController from "./module/user/user.controller.js";
import postController from "./module/post/post.controller.js";
import commentController from "./module/comment/comment.controller.js";
import "./DB/model/associations.js";
import { notFoundMiddelWare } from "./middleware/notFound.middeleware.js";
import { golbalErrorMiddleware } from "./middleware/error.golobalHandel.js";
async function bootStrap() {
  const app = express();
  // console.log("amir");
  app.use(express.json());
  app.use("/user", userController);
  app.use("/post", postController);
  app.use("/comment", commentController);

  await testDbConnection();
  await syncDB({ alter: false });

  app.use("{/*dummy}", notFoundMiddelWare);
  app.use(golbalErrorMiddleware);
  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
}
bootStrap();
