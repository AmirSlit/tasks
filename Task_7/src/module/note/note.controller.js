import { Router } from "express";
import {
  createNote,
  deleteAllNotes,
  deleteNote,
  getListNotes,
  getNoteByContent,
  getNoteById,
  getNoteWithTitle,
  getNoteWithUser,
  replaceNote,
  updateAllNotes,
  updateNote,
} from "./note.service.js";

const noteRouter = Router();
// 1. Create a Single Note
noteRouter.post("/create-note/:userId", async (req, res) => {
  const queryResult = await createNote(req.params.userId, req.body);
  res.status(201).json({ msg: "Note created", queryResult: queryResult });
});
// 2. Update a single Note by its id and return the updated note.
noteRouter.patch("/update-note/:userId/:notId", async (req, res) => {
  const queryResult = await updateNote(
    req.params.userId,
    req.params.notId,
    req.body,
  );
  res.status(200).json({ msg: "updated", queryResult: queryResult });
});
// 3. Replace the entire note document with the new data provided in the request body.
noteRouter.put("/replace/:noteId/:userId", async (req, res) => {
  const queryResult = await replaceNote(
    req.params.noteId,
    req.params.userId,
    req.body,
  );
  res.status(200).json({ queryResult: queryResult });
});
// 4. Updates the title of all notes created by a logged-in user.)
noteRouter.patch("/update-all-notes/:userId", async (req, res) => {
  const queryResult = await updateAllNotes(req.params.userId, req.body);
  res.status(200).json({ msg: "All Notes updated", queryResult: queryResult });
});

// 6. Delete a single Note by its id and return the deleted note.
noteRouter.delete("/delete-note/:noteId/:userId", async (req, res) => {
  const queryResult = await deleteNote(req.params.noteId, req.params.userId);
  res.status(200).json({ msg: "deleted!", queryResult: queryResult });
});
// 7. Retrieve a paginated list of notes for the logged-in user,
noteRouter.get("/get-all-notes/paginate-sort/:userId", async (req, res) => {
  const queryResult = await getListNotes(req.params.userId, req.query);
  res.status(200).json({ queryResult: queryResult });
});
// 9. Get a note for logged-in user by its content.
noteRouter.get("/get-note/by-content/:userId/", async (req, res) => {
  const queryResult = await getNoteByContent(req.params.userId, req.query);
  res.status(200).json({ queryResult: queryResult });
});
// 8. Get a note by its id.
noteRouter.get("/get-note/:noteId/:userId", async (req, res) => {
  const queryResult = await getNoteById(req.params.noteId, req.params.userId);
  res.status(200).json({ queryResult: queryResult });
});
// 10. Retrieves all notes for the logged-in user with user information,
noteRouter.get("/notes/note-with-user/:userId", async (req, res) => {
  const queryResult = await getNoteWithUser(req.params.userId);
  res.status(200).json({ queryResult: queryResult });
});
// 11. Using aggregation, retrieves all notes for the logged-in user with user information
noteRouter.get("/notes/aggregate/:userId", async (req, res) => {
  const queryResult = await getNoteWithTitle(req.params.userId, req.query);
  res.status(200).json({ queryResult: queryResult });
});
// 12. Delete all notes for the logged-in user.
noteRouter.delete("/delete-all-notes/:userId", async (req, res) => {
  const queryResult = await deleteAllNotes(req.params.userId);
  res.status(200).json({ queryResult: queryResult });
});

export default noteRouter;
