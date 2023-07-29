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
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: undefined,
    },
    participants: [
      {
        user: {
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
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Conversation", conversationSchema);
