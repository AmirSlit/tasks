import { Router } from "express";
import localUpload from "../../common/utils/multer/multer.config.js";
import { handelFileMiddleware } from "../../middleware/multer.middleware.js";
import {
  deleteMessage,
  getAllMessages,
  getMessageById,
  sendMessage,
} from "./message.service.js";
import { successResponse } from "../../common/response/success.response.js";
import auth from "../../middleware/authentication.middleware.js";

const messageRouter = Router();

messageRouter.post(
  "/send-message",
  (req, res, next) => {
    if (req.headers.authorization) {
      const authMiddleware = auth();
      return authMiddleware(req, res, next);
    }
    next();
  },
  handelFileMiddleware({
    multerMiddleware: localUpload({ fileSize: 5, folderName: "Message" }).any(),
    folderName: "Message",
  }),
  async (req, res) => {
    const result = await sendMessage(req.body, req.files, req.user?.id);
    successResponse({ res, data: result });
  },
);

messageRouter.delete("/:messageId", auth(), async (req, res) => {
  await deleteMessage(req.params.messageId, req.user);
  successResponse({ res });
});

messageRouter.get("/:messageId", auth(), async (req, res) => {
  const result = await getMessageById(req.params.messageId, req.user);
  successResponse({ res, data: result });
});

messageRouter.get("/", auth(), async (req, res) => {
  const result = await getAllMessages(req.user);
  successResponse({ res, data: result });
});

export default messageRouter;
