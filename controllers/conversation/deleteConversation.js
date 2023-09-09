import asyncHandler from "../../utils/asyncHandler.js";
import CustomError from "../../utils/CustomError.js";
import Conversation from "../../schemas/conversation.schema.js";
import Message from "../../schemas/message.schema.js";

/********************************************************
 * @DELETE_CONVERSATION
 * @METHOD DELETE
 * @route /api/conversation/:conversationId
 * @description Delete a conversation
 * @parameters conversationId (in URL)
 * @return deleted conversation object
 *********************************************************/

const deleteConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { conversation } = req;

  conversation.participants.forEach((participant) => {
    participant.isDeleted = true;
  });

  await conversation.save();

  const allParticipantsDeleted = conversation.participants.every(
    (participant) => participant.isDeleted
  );

  if (allParticipantsDeleted) {
    await Message.deleteMany({ conversation: conversationId });
    await Conversation.findByIdAndDelete(conversationId);
  }

  res.status(200).json({
    success: true,
    message: "Conversation Deleted",
    conversation,
  });
});

export default deleteConversation;
