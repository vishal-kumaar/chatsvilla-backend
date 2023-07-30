import mongoose from "mongoose";
import { messageTypeEnum } from "../utils/enums.js";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipients: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        isDeleted: {
          type: Boolean,
          default: false,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
      },
    ],
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    messageType: {
      type: String,
      enum: messageTypeEnum,
      default: "text",
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", messageSchema);
