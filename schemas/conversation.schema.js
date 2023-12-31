import mongoose from "mongoose";
import { conversationTypeEnum } from "../utils/enums.js";

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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Conversation", conversationSchema);
