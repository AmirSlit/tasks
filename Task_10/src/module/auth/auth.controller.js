import { Router } from "express";
import { login, signup, signupOrLoginWithGoogle } from "./auth.service.js";
import { successResponse } from "../../common/response/success.response.js";
import validation from "../../middleware/validation.middleware.js";
import { loginSchema, signupSchema } from "./auth.validation.js";
const authRouter = Router();

authRouter.post("/signup", validation(signupSchema), async (req, res) => {
  const result = await signup(req.body);
  successResponse({ res, statusCode: 201, msg: "Created!", data: result });
});
authRouter.post("/login", validation(loginSchema), async (req, res) => {
  const result = await login(req.validateData);
  successResponse({ res, statusCode: 200, msg: "Done!", data: result });
});
authRouter.post("/login-with-gmail", async (req, res) => {
  const { tokens, statusCode } = await signupOrLoginWithGoogle(
    req.body.idToken,
  );
  successResponse({ res, statusCode, data: tokens });
});

export default authRouter;
