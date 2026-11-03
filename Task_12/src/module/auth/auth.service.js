import {
  BadRequestExceptions,
  ConflictExceptions,
  NotFoundExceptions,
} from "../../common/exceptions/app.exceptions.js";
import { createDoc, findOneDoc } from "../../DB/db.repo.js";
import userModel from "../../model/user.model.js";
import { compareHash, hashValue } from "../../common/security/hash.js";
import { HashToolEnum } from "../../common/enum/hash.enum.js";
import {
  decryptValue,
  encryptValue,
} from "../../common/security/encryption.js";

import { createLoginToken } from "../../common/security/token.security.js";
import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID } from "../../config/config.js";
import { ProviderEnum } from "../../common/enum/user.enum.js";
import generateOtp from "../../common/otp.js";
import {
  checkOTP,
  sendMail,
  sendOTP,
} from "../../common/utils/email/email.service.js";
import {
  delKey,
  getAllKeys,
  getBannedEmailKey,
  getBaseUserRevokeTokenKey,
  getEmailKey,
  getTrialsEmailKey,
  getValue,
  isExists,
  setValue,
  ttlKey,
} from "../../common/cache.service.js";
import { EmailSubjectEnum } from "../../common/enum/email.enum.js";
import emailEvent from "../../common/utils/email/email.event.js";

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

  emailEvent.emit("send-otp", {
    email,
    subject: EmailSubjectEnum.CONFIRM_EMAIL,
  });
  const newUser = await createDoc({ model: userModel, insertedData: userData });
  return newUser;
}

export async function confirmEmail(bodyData) {
  const { email, otp } = bodyData;
  const user = await findOneDoc({
    model: userModel,
    filter: { email, confirmEmail: false },
  });

  if (!user) {
    throw NotFoundExceptions({ errMsg: "Invalid Account" });
  }

  const hashedOtp = await getValue(
    getEmailKey(email, EmailSubjectEnum.CONFIRM_EMAIL),
  );

  if (!hashedOtp) {
    throw BadRequestExceptions({ errMsg: "OTP Expire" });
  }

  const isOTPValid = await compareHash({
    value: otp,
    hash: hashedOtp,
    tool: HashToolEnum.BCRYPT,
  });

  if (!isOTPValid) {
    throw BadRequestExceptions({ errMsg: "Invalid OTP" });
  }

  user.confirmEmail = true;
  await user.save();
  await delKey(getEmailKey(email, EmailSubjectEnum.CONFIRM_EMAIL));
}

export async function resendOTP(email) {
  const user = await findOneDoc({
    model: userModel,
    filter: { email, confirmEmail: false },
  });

  if (!user) {
    return;
  }

  await checkOTP(email, EmailSubjectEnum.CONFIRM_EMAIL);

  emailEvent.emit("send-otp", {
    email,
    subject: EmailSubjectEnum.CONFIRM_EMAIL,
  });
}

export async function sendOtpForgetPassword(email) {
  const user = await findOneDoc({
    model: userModel,
    filter: { email, confirmEmail: true },
  });

  if (!user) {
    throw NotFoundExceptions({ errMsg: "Invalid Account" });
  }

  await checkOTP(email, EmailSubjectEnum.FORGET_PASSWORD);

  emailEvent.emit("send-otp", {
    email,
    subject: EmailSubjectEnum.FORGET_PASSWORD,
  });
}

export async function verifyForgetPasswordOTP(bodyData) {
  const { email, otp } = bodyData;
  const user = await findOneDoc({
    model: userModel,
    filter: { email, confirmEmail: true },
  });

  if (!user) {
    throw NotFoundExceptions({ errMsg: "Invalid Account" });
  }

  const hashedOtp = await getValue(
    getEmailKey(email, EmailSubjectEnum.FORGET_PASSWORD),
  );

  if (!hashedOtp) {
    throw BadRequestExceptions({ errMsg: "OTP Expire" });
  }

  const isOTPValid = await compareHash({
    value: otp,
    hash: hashedOtp,
    tool: HashToolEnum.BCRYPT,
  });

  if (!isOTPValid) {
    throw BadRequestExceptions({ errMsg: "Invalid OTP" });
  }
  return user;
}

export async function resetPassword(bodyData) {
  const { email, otp, password } = bodyData;

  const user = await verifyForgetPasswordOTP({ email, otp });

  user.password = await setValue({ value: password });
  user.changeCredentialTime = new Date();
  await user.save();
  const userTokenKeys = await getAllKeys(getBaseUserRevokeTokenKey(user.id));

  const userEmailKeys = await getAllKeys(
    getEmailKey(email, EmailSubjectEnum.FORGET_PASSWORD),
  );
  console.log({ userTokenKeys, userEmailKeys });

  // await delKey([...userTokenKeys, ...userEmailKeys]);
}
export async function login(userData) {
  const { email, password } = userData;
  const user = await findOneDoc({ model: userModel, filter: { email } });
  if (!user) {
    throw NotFoundExceptions({ errMsg: "Invalid email or password" });
  }

  if (!user.confirmEmail) {
    throw BadRequestExceptions({ errMsg: "Confirm your email first " });
  }
  const isMatch = await compareHash({
    value: password,
    hash: user.password,
    tool: HashToolEnum.BCRYPT,
  });
  if (!isMatch) {
    throw NotFoundExceptions({ errMsg: "Invalid email or password" });
  }

  return createLoginToken({ user });
}
