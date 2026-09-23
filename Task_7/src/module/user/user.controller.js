import { Router } from "express";
import { deleteUser, getUser, updateUser } from "./user.service.js";

const userRouter = Router();
// 3. Update logged-in user information
userRouter.patch("/users/:id", async (req, res) => {
  const queryResult = await updateUser(req.params.id, req.body);
  res.status(200).json({ msg: "User Updated", queryResult: queryResult });
});
// 4. Delete logged-in user.
userRouter.delete("/delete/:userId", async (req, res) => {
  const queryResult = await deleteUser(req.params.userId);
  res.status(200).json({ queryResult: queryResult });
});
// 5. Get logged-in user data by his ID.
userRouter.get("/get/:userId", async (req, res) => {
  const queryResult = await getUser(req.params.userId);
  res.status(200).json({ queryResult: queryResult });
});
export default userRouter;
