import asyncHandler from "../../utils/asyncHandler.js";
import CustomError from "../../utils/CustomError.js";
import Conversation from "../../schemas/conversation.schema.js";
import Message from "../../schemas/message.schema.js";

/********************************************************
 * @SEND_MESSAGE
 * @METHOD POST
 * @route /api/conversations/:conversationId/messages
 * @description Send a new message to a conversation
 * @parameters conversationId (in URL)
 * @body message (in request body)
 * @return sent message object
 *********************************************************/

const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { message } = req.body;
  const senderId = req.user._id;

  if (!message) {
    throw new CustomError("Message is required", 400);
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new CustomError("Conversation not found", 404);
  }

  if (
    !conversation.participants.some((participant) =>
      participant.user.equals(senderId)
    )
  ) {
    throw new CustomError(
      "You are not a participant in this conversation",
      403
    );
  }

  const newMessage = new Message({
    sender: senderId,
    recipients: conversation.participants.map((participant) => ({
      user: participant.user,
    })),
    conversation: conversationId,
    message,
  });

  await newMessage.save();

  conversation.messages.push(newMessage._id);
  conversation.lastMessage = newMessage._id;
  await conversation.save();

  res.status(201).json({
    success: true,
    message: newMessage,
  });
});

export default sendMessage;
