import mongoose from "mongoose";
import { conversationTypeEnum } from "../utils/enums";

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: conversationTypeEnum,
      required: true,
      default: "Individual",
    },
    groupPicture: {
      type: String,
      default: undefined,
    },
    groupName: {
      type: String,
      default: undefined,
    },
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        unreadMessageCount: {
          type: Number,
          default: 0,
        },
        isDeleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    messagesId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    lastMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Conversation", conversationSchema);
