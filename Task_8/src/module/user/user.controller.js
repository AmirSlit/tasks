import { Router } from "express";
import { successResponse } from "../../common/response/success.response.js";

import auth from "../../middleware/authentication.middleware.js";
import { TokenTypeEnum } from "../../common/enum/token.enum.js";
import { rotateToken } from "./user.service.js";

const userRouter = Router();

userRouter.get("/get-profile", auth(), async (req, res) => {
  successResponse({ res, data: { user: req.user, payload: req.payload } });
});

userRouter.post(
  "/rotate-token",
  auth(TokenTypeEnum.REFRESH),
  async (req, res) => {
    const result = await rotateToken(req.payload);
    successResponse({ res, data: result });
  },
);

export default userRouter;
