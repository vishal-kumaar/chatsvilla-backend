import asyncHandler from "../../utils/asyncHandler.js";
import CustomError from "../../utils/CustomError.js";
import Conversation from "../../schemas/conversation.schema.js";

/********************************************************
 * @MARK_CONVERSATION_AS_READ
 * @METHOD PUT
 * @route /api/conversations/:conversationId/mark-read
 * @description Mark a conversation as read for a specific user
 * @parameters conversationId (in URL)
 * @return updated conversation object
 *********************************************************/

const markConversationAsRead = asyncHandler(async (req, res) => {
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
    throw new CustomError("Conversation has been deleted", 404);
  }

  conversation.messages.forEach((message) => {
    const recipientIndex = message.recipients.findIndex((recipient) =>
      recipient.user.equals(user._id)
    );
    if (recipientIndex !== -1 && !message.recipients[recipientIndex].isRead) {
      message.recipients[recipientIndex].isRead = true;
    }
  });

  await conversation.save();

  res.status(200).json({
    success: true,
    conversation,
  });
});

export default markConversationAsRead;
