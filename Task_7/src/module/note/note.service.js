import mongoose from "mongoose";
import noteModel from "../../model/note.model.js";
import userModel from "../../model/user.model.js";

export async function createNote(userId, noteData) {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new Error("User is not found", { cause: { statusCode: 404 } });
  }
  const note = await noteModel.create({ ...noteData, userId });
  return note;
}

export async function updateNote(userId, noteId, updateData) {
  const note = await noteModel.findById(noteId);
  if (!note) {
    throw new Error("Note is not found", { cause: { statusCode: 400 } });
  }
  if (note.userId.toString() !== userId) {
    throw new Error("You are not the owner", { cause: { statusCode: 400 } });
  }
  const updateNote = await noteModel.findByIdAndUpdate(noteId, updateData, {
    returnDocument: "after",
  });

  return updateNote;
}

export async function updateAllNotes(userId, notesData) {
  const { title } = notesData;
  const notes = await noteModel.updateMany(
    { userId },
    {
      $set: {
        title,
      },
    },
    { returnDocument: "after" },
  );
  if (!notes.matchedCount) {
    throw new Error("No note found", { cause: { statusCode: 404 } });
  }
  return notes;
}

export async function deleteNote(noteId, userId) {
  const note = await noteModel.findById(noteId);
  if (!note) {
    throw new Error("Note not found", { cause: { statusCode: 404 } });
  }
  if (note.userId.toString() !== userId) {
    throw new Error("You are not the owner", { cause: { statusCode: 400 } });
  }
  const deletedNote = await noteModel.findByIdAndDelete(
    { _id: noteId },
    { returnDocument: "after" },
  );
  return deletedNote;
}

export async function replaceNote(noteId, userId, noteData) {
  const note = await noteModel.findById(noteId);
  if (!note) {
    throw new Error("Note not found", { cause: { statusCode: 404 } });
  }
  if (!note.userId || note.userId.toString() !== userId) {
    throw new Error("You are not the owner", { cause: { statusCode: 400 } });
  }

  const replacedNote = await noteModel.findOneAndReplace(
    { _id: noteId },
    noteData,
    { returnDocument: "after" },
  );

  return replacedNote;
}

export async function getListNotes(userId, queryData) {
  let { limit, page } = queryData;
  limit = Number(limit);
  page = Number(page);
  const skip = (page - 1) * limit;
  const getNotes = await noteModel
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
  return getNotes;
}

export async function getNoteById(noteId, userId) {
  const note = await noteModel.findById(noteId);
  if (!note) {
    throw new Error("Note not found", { cause: { statusCode: 404 } });
  }
  if (note.userId.toString() !== userId) {
    throw new Error("You are not the owner", { cause: { statusCode: 400 } });
  }
  return note;
}

export async function getNoteByContent(userId, queryData) {
  const { content } = queryData;
  const note = await noteModel.findOne({ content });
  if (!note) {
    throw new Error("Note not found", { cause: { statusCode: 404 } });
  }
  if (note.userId.toString() !== userId) {
    throw new Error("You are not the owner", { cause: { statusCode: 400 } });
  }
  return note;
}

export async function getNoteWithUser(userId) {
  const notes = await noteModel
    .find({ userId })
    .select("_id title createdAt")
    .populate("userId", "email -_id");
  if (!notes || notes.length === 0) {
    throw new Error("notes not found", { cause: { statusCode: 404 } });
  }
  return notes;
}

export async function getNoteWithTitle(userId, queryData) {
  const { title } = queryData;
  const matchStage = { userId: new mongoose.Types.ObjectId(userId) };

  if (title) {
    matchStage.title = { $regex: title, $options: "i" };
  }

  const notes = await noteModel.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        title: 1,
        userId: 1,
        createdAt: 1,
        "user.name": 1,
        "user.email": 1,
      },
    },
  ]);

  return notes;
}

export async function deleteAllNotes(userId) {
  const deleted = await noteModel.deleteMany({ userId });
  return deleted;
}
