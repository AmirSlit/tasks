import { bsonType, ObjectId } from "bson";
import { DB } from "../../DB/conniction.db.js";

export async function creatBooks() {
  await DB.createCollection("books", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["title"],
        properties: {
          title: { bsonType: "string", minLength: 1 },
        },
      },
    },
  });
}

export async function createIndex() {
  const Index = await DB.collection("books").createIndex({ title: 1 });
  return Index;
}

export async function insertBook(bookData) {
  const insertBook = await DB.collection("books").insertOne({ ...bookData });
  return insertBook;
}

export async function insertBooks(bookData) {
  const insertBook = await DB.collection("books").insertMany(bookData);
  return insertBook;
}

export async function updateBook(updateData) {
  const { book_id } = updateData;
  const updateBook = await DB.collection("books").updateOne(
    { _id: ObjectId.createFromHexString(book_id) },
    { $set: updateData },
  );
  return updateBook;
}

export async function findBook(query) {
  const { title } = query;
  if (!title) {
    throw new Error("title is requierd", { cause: { statusCode: 400 } });
  }
  const Book = await DB.collection("books").findOne({ title });
  return Book;
}

export async function findBookyear(query) {
  let { to, from } = query;
  if (!to || !from) {
    throw new Error("to and from is requierd", { cause: { statusCode: 400 } });
  }
  to = parseInt(to);
  from = parseInt(from);
  const findYear = await DB.collection("books")
    .find({ year: { $gte: from, $lte: to } })
    .toArray();
  return findYear;
}

export async function findBookInclude(query) {
  let { genres } = query;
  if (!genres) {
    throw new Error("the word is requierd", { cause: { statusCode: 400 } });
  }

  const findInclude = await DB.collection("books").find({ genres }).toArray();
  return findInclude;
}

export async function findSkip() {
  const findSkip = await DB.collection("books")
    .find({}, { skip: 2, limit: 3, sort: { year: -1 } })
    .toArray();
  return findSkip;
}

export async function findYearInt() {
  const findYear = await DB.collection("books")
    .find({ year: { $type: "int" } })
    .toArray();
  return findYear;
}

export async function findBookNotInclude() {
  const findNotInclude = await DB.collection("books")
    .find({
      genres: { $nin: ["Horror", "Science Fiction"] },
    })
    .toArray();
  return findNotInclude;
}

export async function deleteBook() {
  const deleted = await DB.collection("books").deleteMany(
    {},
    { year: { $lte: 2000 } },
  );
  return deleted;
}

export async function aggregateFunction1() {
  const aggregate1 = await DB.collection("books")
    .aggregate([{ $match: { year: { $gt: 2000 } } }, { $sort: { year: -1 } }])
    .toArray();
  return aggregate1;
}

export async function aggregateFunction2() {
  const aggregate2 = await DB.collection("books")
    .aggregate([
      { $match: { year: { $gt: 2000 } } },
      { $project: { title: 1, Author: 1, year: 1, _id: 0 } },
    ])
    .toArray();
  return aggregate2;
}

export async function aggregateFunction3() {
  const aggregate3 = await DB.collection("books")
    .aggregate([
      { $unwind: "$genres" },
      { $project: { title: 1, genres: 1, _id: 0 } },
    ])
    .toArray();
  return aggregate3;
}

export async function aggregateFunction4() {
  const aggregate4 = await DB.collection("logs")
    .aggregate([
      {
        $lookup: {
          from: "books",
          localField: "book_id",
          foreignField: "_id",
          as: "book_details",
        },
      },
      {
        $project: {
          action: 1,
          _id: 0,
          "book_details.title": 1,
          "book_details.Author": 1,
          "book_details.year": 1,
        },
      },
    ])
    .toArray();
  return aggregate4;
}
