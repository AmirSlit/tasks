import { Router } from "express";
import { successResponse } from "../../common/response/success.response.js";

import { TokenTypeEnum } from "../../common/enum/token.enum.js";
import { rotateToken } from "./user.service.js";
import authorization from "../../middleware/authorization.middleware.js";
import { RoleEnum } from "../../common/enum/user.enum.js";
import auth from "../../middleware/authentication.middleware.js";

const userRouter = Router();

userRouter.get(
  "/get-profile",
  auth(),
  authorization([RoleEnum.ADMIN]),
  async (req, res) => {
    successResponse({ res, data: { user: req.user, payload: req.payload } });
  },
);

userRouter.post(
  "/rotate-token",
  auth(TokenTypeEnum.REFRESH),
  async (req, res) => {
    const result = await rotateToken(req.payload);
    successResponse({ res, data: result });
  },
);

export default userRouter;
