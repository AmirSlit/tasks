import { BadRequestExceptions } from "../../common/exceptions/app.exceptions.js";
import { createLoginToken } from "../../common/security/token.security.js";
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} from "../../config/config.js";

export async function rotateToken(payload) {
  const tokenExpireDate = payload.iat + JWT_ACCESS_EXPIRES_IN;
  const currentDate = Date.now() / 1000;
  // if (tokenExpireDate > currentDate) {
  //   throw BadRequestExceptions({ errMsg: "Old Taken Still Valid" });
  // }

  return createLoginToken({
    payload: { sub: payload.sub },
    refreshExpiresIn:
      JWT_REFRESH_EXPIRES_IN - (Math.ceil(Date.now() / 1000) - payload.iat),
  });
}
