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

  let unreadMessageCount = 0;
  const filterMessage = conversation.messages.filter((message) => {
    const recipients = message.recipients;
    for (let recipient of recipients) {
      if (message.sender._id.equals(user._id)) {
        return message;
      } else if (recipient.user.equals(user._id) && !recipient.isDeleted) {
        if (!recipient.isRead) {
          unreadMessageCount++;
        }
        return message;
      }
    }
  });

  let participantUser = undefined;
  if (conversation.type === "Individual") {
    for (let participant of conversation.participants) {
      if (!participant.user._id.equals(user._id)) {
        participantUser = participant;
      }
    }
    conversation.participants = undefined;
  }

  const conversationsWithUnreadCount = {
    userId: user._id,
    participant: participantUser,
    ...conversation.toObject(),
    messages: filterMessage,
    unreadMessageCount,
  };

  res.status(200).json({
    success: true,
    conversation: conversationsWithUnreadCount,
  });
});

export default getConversation;
