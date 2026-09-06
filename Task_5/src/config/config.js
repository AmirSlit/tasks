import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path:
    process.env.NODE_ENV == "PROD"
      ? path.resolve(".env.prod")
      : path.resolve(".env.dev"),
});

export const port = Number(process.env.PORT) || 3000;
export const DB_NAME = process.env.DB_NAME || "";
export const DB_USER = process.env.DB_USER || "";
export const DB_PASSWORD = process.env.DB_PASSWORD || "";
export const DB_HOST = process.env.DB_HOST || "";
export const DB_ENGIN = process.env.DB_ENGIN || "";
