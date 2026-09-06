import { Router } from "express";
import {
  creatBulkCommetns,
  findOrCreate,
  GetSpecificComment,
  searchComment,
  updateComment,
} from "./comment.service.js";

const commentRouter = Router();
// 1. Create a bulk of Comments.
commentRouter.post("/add-comments", async (req, res) => {
  const queryResult = await creatBulkCommetns(req.body);
  res.status(200).json({ msg: "Comments created", queryResult: queryResult });
});
// 2. Update the content of a specific comment by its ID.
commentRouter.patch("/update-comment/:commentId", async (req, res) => {
  const queryResult = await updateComment(req.params.commentId, req.body);
  res.status(200).json({ msg: "comment updated", queryResult: queryResult });
});
// 3. find a comment for a specific post, user, and content.
commentRouter.post("/comments/find-or-create", async (req, res) => {
  const queryResult = await findOrCreate(req.body);
  res.status(200).json({ msg: "find!", queryResult: queryResult });
});
// 4. Retrieve all comments that contain a specific word in their content
commentRouter.get("/comments/search", async (req, res) => {
  const queryresult = await searchComment(req.query.word);
  res.status(200).json({ msg: "Done!", queryresult: queryresult });
});
// 5 Retrieve the 3 most recent comments for a specific post, ordered by creation date.
commentRouter.get("/newest/:postId", async (req, res) => {
  const queryResult = await getNewestComments(req.params.postId);
  res.status(200).json(queryResult);
});
// 6 Get Specific Comment By PK with User and Post Information. (0.5
commentRouter.get("/comments/details/:id", async (req, res) => {
  const queryResult = await GetSpecificComment(req.params.id);
  res.status(200).json({ queryResult: queryResult });
});
export default commentRouter;
