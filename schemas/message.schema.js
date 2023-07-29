import mongoose from "mongoose";
import { messageTypeEnum } from "../utils/enums";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipients: [
      {
        userId: {
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
    conversationId: {
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", messageSchema);
