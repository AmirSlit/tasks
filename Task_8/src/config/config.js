import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path:
    process.env.NODE_ENV == "PROD"
      ? path.resolve("./.env.prod")
      : path.resolve("./.env.dev"),
});

export const port = Number(process.env.PORT) || 3000;

export const USER_NAME = process.env.USER_NAME || "";

export const DB_NAME = process.env.DB_NAME || "";
export const DB_URI = process.env.DB_ATLAS || "";
export const SALT_ROUND = Number(process.env.SALT_ROUND) || "";
export const ENCRYPT_KEY = process.env.ENCRYPT_KEY || "";
export const JWT_ACCESS_EXPIRES_IN = Number(process.env.JWT_ACCESS_EXPIRES_IN);
export const JWT_ACCESS_SIGNATURE = process.env.JWT_ACCESS_SIGNATURE;
export const JWT_REFRESH_EXPIRES_IN = Number(
  process.env.JWT_REFRESH_EXPIRES_IN,
);
export const JWT_REFRESH_SIGNATURE = process.env.JWT_REFRESH_SIGNATURE;
