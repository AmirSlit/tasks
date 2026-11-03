import mongoose, { Schema, Types } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: function () {
        return !this.attachment.length;
      },
    },
    attachment: [String],
    senderId: { type: Types.ObjectId, ref: "Users" },
    receiverId: { type: Types.ObjectId, ref: "Users", required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;
