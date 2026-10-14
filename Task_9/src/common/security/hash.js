import * as bcrypt from "bcrypt";
import * as argon from "argon2";
import { HashToolEnum } from "../enum/hash.enum.js";
import { SALT_ROUND } from "../../config/config.js";
export async function hashValue({
  value,
  saltRound = SALT_ROUND,
  tool = HashToolEnum,
}) {
  let hashedValue;
  switch (tool) {
    case HashToolEnum.BCRYPT:
      hashedValue = await bcrypt.hash(value, saltRound);
      break;
    case HashToolEnum.ARGON:
      hashedValue = await argon.hash(value);
      break;
    default:
      break;
  }

  return hashedValue;
}

export async function compareValue({ value, hash, tool = HashToolEnum }) {
  let compareResult;
  switch (tool) {
    case HashToolEnum.BCRYPT:
      compareResult = await bcrypt.compare(value, hash);
      break;
    case HashToolEnum.ARGON:
      compareResult = await argon.verify(hash, value);
      break;
    default:
      break;
  }

  return compareResult;
}
