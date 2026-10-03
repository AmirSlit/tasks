import { Router } from "express";
import { login, signup } from "./auth.service.js";
import { successResponse } from "../../common/response/success.response.js";

const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const result = await signup(req.body);
  successResponse({ res, statusCode: 201, msg: "Created!", data: result });
});
authRouter.post("/login", async (req, res) => {
  const result = await login(req.body);
  successResponse({ res, statusCode: 200, msg: "Done!", data: result });
});

export default authRouter;
