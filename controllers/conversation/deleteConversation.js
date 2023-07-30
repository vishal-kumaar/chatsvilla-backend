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
  const { user } = req;

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new CustomError("Conversation not found", 404);
  }

  const participant = conversation.participants.find((participant) =>
    participant.user.equals(user._id)
  );

  if (!participant) {
    throw new CustomError(
      "You are not a participant in this conversation",
      403
    );
  }

  if (participant.isDeleted) {
    throw new CustomError("Conversation has already been deleted", 400);
  }

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
    conversation,
  });
});

export default deleteConversation;
