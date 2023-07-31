import asyncHandler from "../../utils/asyncHandler.js";
import CustomError from "../../utils/CustomError.js";
import Conversation from "../../schemas/conversation.schema.js";
import Message from "../../schemas/message.schema.js";

/********************************************************
 * @MARK_CONVERSATION_AS_READ
 * @METHOD PATCH
 * @route /api/conversation/:conversationId/read
 * @description Mark a conversation as read for a specific user
 * @parameters conversationId (in URL)
 * @return updated conversation object
 *********************************************************/

const markConversationAsRead = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { user } = req;

  const messages = await Message.find({
    conversation: conversationId,
    $or: [
      { sender: user._id },
      {
        "recipients.user": user._id,
        "recipients.isDeleted": false,
        "recipients.isRead": false,
      },
    ],
  });

  if (!messages) {
    throw new CustomError("No unread messages found in this conversation", 204);
  }

  messages.map(async (message) => {
    message.recipients.filter((recipient) => {
      recipient.isRead = true;
    });
    await message.save();
  });


  res.status(200).json({
    success: true,
    messages,
  });
});

export default markConversationAsRead;
