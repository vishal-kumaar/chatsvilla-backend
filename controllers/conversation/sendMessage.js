import asyncHandler from "../../utils/asyncHandler.js";
import CustomError from "../../utils/CustomError.js";
import Conversation from "../../schemas/conversation.schema.js";
import Message from "../../schemas/message.schema.js";
import User from "../../schemas/user.schema.js";
import { io, connectedUsers } from "../../app.js";

/********************************************************
 * @SEND_MESSAGE
 * @METHOD POST
 * @route /api/conversation/:conversationId/messages
 * @description Send a new message to an existing conversation or create a new conversation and send the message
 * @parameters conversationId (in URL)
 * @body message (in request body)
 * @return sent message object
 *********************************************************/

const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { message, messageType } = req.body;
  const { user } = req;

  let conversation = await Conversation.findById(conversationId).populate(
    "participants.user"
  );

  if (!conversation) {
    const recipientId = conversationId;

    const recipientUser = await User.findById(recipientId);
    if (!recipientUser) {
      throw new CustomError("Invalid conversationId/recipientId", 404);
    }

    conversation = await Conversation.findOne({
      type: "Individual",
      $and: [
        { "participants.user": user._id },
        { "participants.user": recipientId },
      ],
    }).exec();

    if (!conversation) {
      if (!req.user.friends.includes(recipientId)) {
        throw new CustomError(
          "You can only send messages to your friends. Please request a chat with the recipient.",
          403
        );
      }

      conversation = await Conversation.create({
        participants: [{ user: user._id }, { user: recipientId }],
        type: "Individual",
      });
    }
  } else {
    const isParticipant = conversation.participants.some(
      (participant) => participant.user._id.toString() === user._id.toString()
    );

    if (!isParticipant) {
      throw new CustomError(
        "You are not a participant in this conversation",
        403
      );
    }
  }

  const recipientIds = conversation.participants.map(
    (participant) => participant.user._id
  );

  const newMessage = await Message.create({
    sender: user._id,
    recipients: recipientIds,
    conversation: conversation._id,
    message,
    messageType,
  });

  conversation.participants.forEach((participant) => {
    const recipientId = participant.user._id;
    if (connectedUsers.has(recipientId.toString())) {
      io.to(recipientId).emit("newMessage", newMessage);
    }
  });

  res.status(200).json({
    success: true,
    message: newMessage,
  });
});

export default sendMessage;
