import {
  delKey,
  getAllKeys,
  getBaseUserRevokeTokenKey,
} from "../../common/cache.service.js";
import { LogoutActionEnum } from "../../common/enum/system.enum.js";
import { BadRequestExceptions } from "../../common/exceptions/app.exceptions.js";
import {
  createLoginToken,
  revokeToken,
} from "../../common/security/token.security.js";
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} from "../../config/config.js";

export async function rotateToken(payload) {
  const tokenExpireDate = payload.iat + JWT_ACCESS_EXPIRES_IN;
  const currentDate = Date.now() / 1000;
  if (tokenExpireDate > currentDate) {
    throw BadRequestExceptions({ errMsg: "Old Token Still Valid" });
  }

  const tokens = createLoginToken({
    payload: { sub: payload.sub },
    refreshExpiresIn:
      JWT_REFRESH_EXPIRES_IN - (Math.ceil(Date.now() / 1000) - payload.iat),
  });
  await revokeToken(payload);
  return tokens;
}

export async function logout(payload, user, action) {
  switch (action) {
    case LogoutActionEnum.ONE:
      await revokeToken(payload);
      break;
    case LogoutActionEnum.ALL:
      user.changeCredentialTime = new Date();
      await user.save();
      const userTokenKeys = await getAllKeys(
        getBaseUserRevokeTokenKey(payload.sub),
      );
      if (userTokenKeys.length) await delKey(userTokenKeys);
      break;
    default:
      throw new BadRequestExceptions({
        errMsg: `Invalid logout action: ${action}`,
        statusCode: 500,
      });
  }
}

export async function uploadProfilePic(user, file) {
  user.profilePecPath = file.finalPath;
  await user.save();
}
