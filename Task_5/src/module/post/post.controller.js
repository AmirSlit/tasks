import { Router } from "express";
import {
  countComment,
  creatPost,
  deletPost,
  getAllPosts,
} from "./post.service.js";
import {
  getNewestComments,
  GetSpecificComment,
} from "../comment/comment.service.js";

const postRouter = Router();
// 1. Create new Post
postRouter.post("/creat-post/:userId", async (req, res) => {
  const queryResult = await creatPost(req.body, req.params.userId);
  res
    .status(201)
    .json({ msg: "create the post Done!", queryResult: queryResult });
});
// 2. Delete a post by its id
postRouter.delete("/delete-post/:userId/:postId", async (req, res) => {
  const queryResult = await deletPost(req.params.userId, req.params.postId);
  res.status(200).json({ msg: "post deleted", queryResult: queryResult });
});
// 3. Retrieve all posts, including the details of the user who created each post and the associated comments.
postRouter.get("/posts/details", async (req, res) => {
  const queryresult = await getAllPosts();
  res.status(200).json({ msg: "Done!", queryresult: queryresult });
});
// 4. Retrieve all posts and count the number of comments associated with each post.
postRouter.get("/posts/comment-count", async (req, res) => {
  const queryResult = await countComment();
  res.status(200).json({ msg: "Done!", queryResult: queryResult });
});

export default postRouter;
