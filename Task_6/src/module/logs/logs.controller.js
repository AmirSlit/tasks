import { Router } from "express";
import { createLogs, insertLogs } from "./logs.service.js";

const logsRouter = Router();

// 3. Create a capped collection named “logs” with a size limit of 1MB. (0.5 Grade)
logsRouter.post("/logs/capped", async (req, res) => {
  const queryResult = await createLogs();
  res.status(201).json({ ok: 1 });
});

// 7. Insert a new log into the logs collection.
logsRouter.post("/logs", async (req, res) => {
  const queryResult = await insertLogs(req.body);
  res
    .status(201)
    .json({
      acknowledged: queryResult.acknowledged,
      insertedId: queryResult.insertedId,
    });
});
export default logsRouter;
