import { Sequelize } from "sequelize";
import {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_ENGIN,
} from "../config/config.js";
import { domainToUnicode } from "url";

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_ENGIN,
});

export async function testDbConnection(params) {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export async function syncDB(obj = { alter: false, force: false }) {
  await sequelize.sync(obj);
}
