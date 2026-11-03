import { randomInt } from "node:crypto";

function generateOtp() {
  return randomInt(100000, 999999);
}

export default generateOtp;
