import {
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
import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_SIGNATURE,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SIGNATURE,
} from "../../config/config.js";

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

  const access_token = jwt.sign({}, JWT_ACCESS_SIGNATURE, {
    subject: user.id,
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  });

  const refresh_token = jwt.sign({}, JWT_REFRESH_SIGNATURE, {
    subject: user.id,
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
  return { access_token, refresh_token };
}
