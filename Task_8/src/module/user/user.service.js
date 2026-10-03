import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_SIGNATURE,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SIGNATURE,
} from "../../config/config.js";
import jwt from "jsonwebtoken";
export async function rotateToken(payload) {
  const access_token = jwt.sign({}, JWT_ACCESS_SIGNATURE, {
    subject: payload.sub,
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  });

  const refresh_token = jwt.sign({}, JWT_REFRESH_SIGNATURE, {
    subject: payload.sub,
    expiresIn:
      JWT_REFRESH_EXPIRES_IN - (Math.ceil(Date.now() / 1000) - payload.iat),
  });
  return { access_token, refresh_token };
}
