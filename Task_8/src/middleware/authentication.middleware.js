import { UnAuthorizeException } from "../common/exceptions/app.exceptions.js";
import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_SIGNATURE,
  JWT_REFRESH_SIGNATURE,
} from "../config/config.js";
import { findByIdDoc } from "../DB/db.repo.js";
import userModel from "../model/user.model.js";
import { TokenTypeEnum } from "../common/enum/token.enum.js";

function auth(tokenType = TokenTypeEnum.ACCESS) {
  return async function (req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      throw UnAuthorizeException({ errMsg: "Token Not Found" });
    }

    const payload = jwt.verify(
      token,
      tokenType == TokenTypeEnum.ACCESS
        ? JWT_ACCESS_SIGNATURE
        : JWT_REFRESH_SIGNATURE,
    );
    if (!payload.sub) {
      throw UnAuthorizeException({ errMsg: "Id Not Found" });
    }
    const user = await findByIdDoc({ model: userModel, id: payload.sub });
    if (!user) {
      throw UnAuthorizeException({ errMsg: "User Not Found" });
    }

    req.user = user;
    req.payload = payload;

    next();
  };
}

export default auth;
