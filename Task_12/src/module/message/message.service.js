import { NotFoundExceptions } from "../../common/exceptions/app.exceptions.js";
import {
  createDoc,
  deleteDoc,
  findAllDoc,
  findByIdDoc,
  findOneDoc,
} from "../../DB/db.repo.js";
import messageModel from "../../model/message.model.js";
import userModel from "../../model/user.model.js";

export async function sendMessage(bodyData, filesData, user) {
  const { content, receiverId } = bodyData;

  const receiver = await findByIdDoc({ model: userModel, id: receiverId });

  if (!receiver) {
    throw NotFoundExceptions({ errMsg: "Account Not Found" });
  }

  const finalPaths = filesData.map((ele) => {
    return ele.finalPath;
  });
  const newMessage = await createDoc({
    model: messageModel,
    insertedData: {
      content,
      attachment: finalPaths,
      senderId: user?.id,
      receiverId,
    },
  });
  return newMessage;
}

export async function deleteMessage(messageId, user) {
  const message = await deleteDoc({
    model: messageModel,
    filter: { _id: messageId, receiverId: user.id },
  });

  if (!message.deletedCount) {
    throw NotFoundExceptions({ errMsg: "Message Not Found" });
  }
}

export async function getMessageById(messageId, user) {
  const message = await findOneDoc({
    model: messageModel,
    filter: {
      _id: messageId,
      $or: [{ receiverId: user.id }, { senderId: user.id }],
    },
  });

  if (!message) {
    throw NotFoundExceptions({ errMsg: "Message Not Found" });
  }
  return message;
}

export async function getAllMessages(user) {
  const messages = await findAllDoc({
    model: messageModel,
    filter: {
      $or: [{ receiverId: user.id }, { senderId: user.id }],
    },
  });

  if (!messages.length) {
    throw NotFoundExceptions({ errMsg: "No Messages Found" });
  }
  return messages;
}
