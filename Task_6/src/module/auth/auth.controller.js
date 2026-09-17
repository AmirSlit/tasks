import { Router } from "express";
import { login, signup } from "./auth.service.js";

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const result = await signup(req.body);
  res.status(201).json({ msg: "Done!", newUser: result });
});
userRouter.post("/login", async (req, res) => {
  const result = await login(req.body);
  res.status(200).json({ msg: "Done!", newUser: result });
});

export default userRouter;
