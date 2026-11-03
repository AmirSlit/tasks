import {
  getBannedEmailKey,
  getEmailKey,
  getTrialsEmailKey,
  getValue,
  incrKey,
  isExists,
  setValue,
  ttlKey,
} from "../../cache.service.js";
import { HashToolEnum } from "../../enum/hash.enum.js";
import { BadRequestExceptions } from "../../exceptions/app.exceptions.js";
import generateOtp from "../../otp.js";
import { hashValue } from "../../security/hash.js";
import transporter from "./email.config.js";
import { EmailTemplate } from "./email.template.js";

export async function sendMail({
  to,
  cc,
  bcc,
  subject,
  text,
  html,
  attachments,
}) {
  try {
    const info = await transporter.sendMail({
      from: "amirslit98@gmail.com",
      to,
      cc,
      bcc,
      subject,
      text,
      html,
      attachments,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
}

export async function sendOTP({ email, subject }) {
  const otp = generateOtp();
  await sendMail({
    to: email,
    subject,
    html: EmailTemplate[subject](otp),
  });

  await setValue({
    key: getEmailKey(email, subject),
    value: await hashValue({ value: otp, tool: HashToolEnum.BCRYPT }),
    options: { expiration: { value: 180 } },
  });
  if (await getValue(getTrialsEmailKey(email, subject))) {
    await incrKey({ key: getTrialsEmailKey(email, subject) });
  } else {
    await setValue({
      key: getTrialsEmailKey(email, subject),
      value: 1,
      options: { expiration: { value: 20 * 60 } },
    });
  }
}

export async function checkOTP(email, subject) {
  const oldOTP_TTL = await ttlKey(getEmailKey(email, subject));

  if (oldOTP_TTL > 0) {
    throw BadRequestExceptions({
      errMsg: `Invalid Request, There's Already valid OTP ${oldOTP_TTL}s`,
    });
  }

  const isBlocked = await isExists(getBannedEmailKey(email, subject));

  if (isBlocked) {
    throw BadRequestExceptions({ errMsg: "Pleas Try Again Later" });
  }

  const userTrials = await getValue(getTrialsEmailKey(email, subject));

  if (userTrials == 2) {
    await setValue({
      key: getBannedEmailKey(email, subject),
      value: 0,
      options: { expiration: { value: 25 * 60 } },
    });
  }
}
