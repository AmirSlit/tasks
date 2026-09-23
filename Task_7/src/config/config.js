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
export const DB_URL = process.env.DB_ATLAS;
export const DB_URI = DB_URL + DB_NAME;
