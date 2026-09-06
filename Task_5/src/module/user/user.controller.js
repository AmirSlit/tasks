import { Router } from "express";
import {
  getUser,
  getUserExeclud,
  signupUser,
  updateUser,
} from "./user.service.js";

const userRouter = Router();
// 1. Create a new user (using build and save)
userRouter.post("/signup-user", async (req, res) => {
  const queryResult = await signupUser(req.body);
  res
    .status(201)
    .json({ msg: "User Add Successfully", queryResult: queryResult });
});
// 2. Create or update based on PK and use skip validation option.
userRouter.put("/update-user/:userId", async (req, res) => {
  const queryResult = await updateUser(req.params.userId, req.body);
  res.status(200).json({
    msg: "user create or update successfully",
    queryResult: queryResult,
  });
});
// 3. Write an API endpoint to find a user by their email address.
userRouter.get("/get-user/:email", async (req, res) => {
  const queryResult = await getUser(req.params.email);
  res.status(200).json({ msg: "user is found!", queryResult: queryResult });
});
// 4. Retrieve a user by their PK, excluding the “role” field from the response.
userRouter.get("/get-user-exclude/:userId", async (req, res) => {
  const queryResult = await getUserExeclud(req.params.userId);
  res.status(200).json({ msg: "user is found!", queryResult: queryResult });
});
export default userRouter;
