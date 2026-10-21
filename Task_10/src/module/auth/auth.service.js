import {
  BadRequestExceptions,
  ConflictExceptions,
  NotFoundExceptions,
} from "../../common/exceptions/app.exceptions.js";
import { createDoc, findOneDoc } from "../../DB/db.repo.js";
import userModel from "../../model/user.model.js";
import { compareValue, hashValue } from "../../common/security/hash.js";
import { HashToolEnum } from "../../common/enum/hash.enum.js";
import {
  decryptValue,
  encryptValue,
} from "../../common/security/encryption.js";

import { createLoginToken } from "../../common/security/token.security.js";
import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID } from "../../config/config.js";
import { ProviderEnum } from "../../common/enum/user.enum.js";

const client = new OAuth2Client();

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
}

export async function signupOrLoginWithGoogle(idToken) {
  const result = await verify(idToken);
  if (!result.email_verified) {
    throw BadRequestExceptions({ errMsg: "Please verify your email first" });
  }
  const userData = await findOneDoc({
    model: userModel,
    filter: { email: result.email },
  });

  if (userData) {
    if (userData.provider === ProviderEnum.SYSTEM) {
      throw BadRequestExceptions({
        errMsg: "You can't login with google, you need to login with password",
      });
    }
    if (userData.provider === ProviderEnum.GOOGLE) {
      return { statusCode: 200, tokens: createLoginToken({ user: userData }) };
    }
  }
  const [newUser] = await createDoc({
    model: userModel,
    insertedData: {
      username: result.given_name,
      email: result.email,
      provider: ProviderEnum.GOOGLE,
      confirmEmail: true,
      profilePicPath: result.picture,
    },
  });
  // newUser.id = newUser._id.toString();
  return { statusCode: 201, tokens: createLoginToken({ user: newUser }) };
}

export async function signup(userData) {
  const { email } = userData;
  const user = await findOneDoc({ model: userModel, filter: { email } });
  if (user) {
    throw ConflictExceptions({ errMsg: "Email Already Exists" });
  }

  userData.password = await hashValue({
    value: userData.password,
    tool: HashToolEnum.BCRYPT,
  });

  userData.phone = encryptValue({
    value: userData.phone,
  });

  const newUser = await createDoc({ model: userModel, insertedData: userData });
  return newUser;
}

export async function login(userData) {
  const { email, password } = userData;
  const user = await findOneDoc({ model: userModel, filter: { email } });
  if (!user) {
    throw NotFoundExceptions({ errMsg: "Invalid email or password" });
  }
  const isMatch = await compareValue({
    value: password,
    hash: user.password,
    tool: HashToolEnum.BCRYPT,
  });
  if (!isMatch) {
    throw NotFoundExceptions({ errMsg: "Invalid email or password" });
  }

  return createLoginToken({ user });
}
