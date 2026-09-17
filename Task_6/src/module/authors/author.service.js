import { bsonType } from "bson";
import { DB } from "../../DB/conniction.db.js";

export async function creatAuthors(authorData) {
  const authors = await DB.collection("authors").insertOne(authorData);
  return authors;
}
