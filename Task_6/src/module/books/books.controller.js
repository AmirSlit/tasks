import { Router } from "express";
import {
  aggregateFunction1,
  aggregateFunction2,
  aggregateFunction3,
  aggregateFunction4,
  creatBooks,
  createIndex,
  deleteBook,
  findBook,
  findBookInclude,
  findBookNotInclude,
  findBookyear,
  findSkip,
  findYearInt,
  insertBook,
  insertBooks,
  updateBook,
} from "./books.service.js";

const booksRouter = Router();

// 1. Create an explicit collection named “books” with a validation rule to ensure that each
booksRouter.post("/books", async (req, res) => {
  try {
    const queryResult = await creatBooks();
    res.status(201).json({ ok: 1 });
  } catch (error) {
    res.status(500).json({ ok: 0, error: error.message });
  }
});

// 4. Create an index on the books collection for the title field.
booksRouter.post("/books/index", async (req, res) => {
  try {
    const queryResult = await createIndex();
    res.status(201).json({ msg: "created Index!", queryResult: queryResult });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// 5. Insert one document into the books collection.
booksRouter.post("/insert-book", async (req, res) => {
  try {
    const queryResult = await insertBook(req.body);
    res.status(201).json({
      acknowledged: queryResult.acknowledged,
      insertedId: queryResult.insertedId,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// 6. Insert multiple documents into the books collection with at leastthree records.
booksRouter.post("/insert-multi-books", async (req, res) => {
  try {
    const queryResult = await insertBooks(req.body);
    res.status(201).json({
      acknowledged: queryResult.acknowledged,
      insertedId: queryResult.insertedIds,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// 8. Update the book with title “Future” change the year to be 2022.
booksRouter.patch("/books/future", async (req, res) => {
  try {
    const queryResult = await updateBook(req.body);
    res.status(200).json({
      msg: "Updated!",
      acknowledged: queryResult.acknowledged,
      matchedCount: queryResult.matchedCount,
      modifiedCount: queryResult.modifiedCount,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// 9. Find a Book with title “Brave New World”.
booksRouter.get("/books/title", async (req, res) => {
  try {
    const queryResult = await findBook(req.query);
    res.status(200).json({ queryResult: queryResult });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// 10. Find all books published between 1990 and 2010.
booksRouter.get("/books/year", async (req, res) => {
  try {
    const queryResult = await findBookyear(req.query);
    res.status(200).json({ queryResult: queryResult });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// 11. Find books where the genre includes "Science Fiction".
booksRouter.get("/books/genre", async (req, res) => {
  try {
    const queryResult = await findBookInclude(req.query);
    res.status(200).json({ queryResult: queryResult });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// 12. Skip the first two books, limit the results to the next three, sorted by year in descending order.
booksRouter.get("/books/skip-limit", async (req, res) => {
  try {
    const queryResult = await findSkip();
    res.status(200).json({ queryResult: queryResult });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// 13. Find books where the year field stored as an integer.
booksRouter.get("/books/year-integer", async (req, res) => {
  try {
    const queryResult = await findYearInt();
    res.status(200).json({ queryResult: queryResult });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// 14. Find all books where the genres field does not include any of the genres "Horror" or "Science Fiction".
booksRouter.get("/books/exclude-genres", async (req, res) => {
  try {
    const queryResult = await findBookNotInclude();
    res.status(200).json({ queryResult: queryResult });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// 15. Delete all books published before 2000.
booksRouter.delete("/books/before-year", async (req, res) => {
  try {
    const queryResult = await deleteBook(req.query);
    res.status(200).json({});
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// 16. Using aggregation Functions, Filter books published after 2000 and sort them by year descending.
booksRouter.get("/books/aggregate1", async (req, res) => {
  try {
    const queryResult = await aggregateFunction1();
    res.status(200).json({ queryResult: queryResult });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// 17. Using aggregation functions, Find all books published after the year 2000. For each
// matching book, show only the title, author, and year fields.
booksRouter.get("/books/aggregate2", async (req, res) => {
  try {
    const queryResult = await aggregateFunction2();
    res.status(200).json({ queryResult: queryResult });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// 18. Using aggregation functions,break an array of genres into separate documents.
booksRouter.get("/books/aggregate3", async (req, res) => {
  try {
    const queryResult = await aggregateFunction3();
    res.status(200).json({ queryResult: queryResult });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// 19. Using aggregation functions, Join the books collection with the logs collection.
booksRouter.get("/books/aggregate4", async (req, res) => {
  const queryResult = await aggregateFunction4();
  res.status(200).json({ queryResult: queryResult });
});
export default booksRouter;
