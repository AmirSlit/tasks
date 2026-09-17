import { ObjectId } from "mongodb";
import { DB } from "../../DB/conniction.db.js";

export async function createLogs() {
  const loges = await DB.createCollection("logs", {
    capped: true,
    size: 1000,
  });
}

export async function insertLogs(logsData) {
  const { book_id } = logsData;
  const insert = await DB.collection("logs").insertOne({
    ...logsData,
    book_id: ObjectId.createFromHexString(book_id),
  });
  return insert;
}
