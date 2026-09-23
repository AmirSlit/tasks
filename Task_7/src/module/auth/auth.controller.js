import { Router } from "express";
import { login, signup } from "./auth.service.js";

const authRouter = Router();
// 1. Signup
authRouter.post("/users/signup", async (req, res) => {
  const result = await signup(req.body);
  res.status(201).json({ msg: "User Add Successfully.", newUser: result });
});
// 2. Login
authRouter.post("/users/login", async (req, res) => {
  const result = await login(req.body);
  res.status(200).json({ msg: "Done!", newUser: result });
});

export default authRouter;
