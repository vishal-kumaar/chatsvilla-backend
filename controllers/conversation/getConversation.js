import asyncHandler from "../../utils/asyncHandler.js";

/********************************************************
 * @GET_CONVERSATION
 * @METHOD GET
 * @route /api/conversation/:conversationId
 * @description Get details of a specific conversation
 * @parameters conversationId (in URL)
 * @return conversation object
 *********************************************************/

const getConversation = asyncHandler(async (req, res) => {
  const { user, conversation } = req;

  const unreadMessageCount = conversation.messages.reduce((count, message) => {
    let isRead = false;
    const isRecipient = message.recipients.some((recipient) => {
      isRead = recipient.isRead;
      return recipient.user.equals(user._id);
    });
    if (isRecipient && !isRead) {
      count += 1;
    }
    return count;
  }, 0);

  res.status(200).json({
    success: true,
    conversation,
    unreadMessageCount,
  });
});

export default getConversation;
