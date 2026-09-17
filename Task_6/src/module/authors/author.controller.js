import { Router } from "express";
import { creatAuthors } from "./author.service.js";

const authorsRouter = Router();

// 2. Create an implicit collection by inserting data directly into a new collection named
// “authors”.
authorsRouter.post("/authors", async (req, res) => {
  const queryResult = await creatAuthors(req.body);
  res.status(201).json({
    acknowledged: queryResult.acknowledged,
    insertedId: queryResult.insertedId,
  });
});

export default authorsRouter;
