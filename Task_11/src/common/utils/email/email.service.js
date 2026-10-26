import {
  getConfirmEmail,
  getConfirmTrialsEmail,
  getValue,
  incrKey,
  setValue,
} from "../../cache.service.js";
import { HashToolEnum } from "../../enum/hash.enum.js";
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
    key: getConfirmEmail(email),
    value: await hashValue({ value: otp, tool: HashToolEnum.BCRYPT }),
    options: { expiration: { value: 180 } },
  });
  if (await getValue(getConfirmTrialsEmail(email))) {
    await incrKey({ key: getConfirmTrialsEmail(email) });
  } else {
    await setValue({
      key: getConfirmTrialsEmail(email),
      value: 1,
      options: { expiration: { value: 20 * 60 } },
    });
  }
}
