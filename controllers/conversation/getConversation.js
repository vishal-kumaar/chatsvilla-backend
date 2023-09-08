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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const categorizedMessages = {};

  conversation.messages.forEach((message) => {
    const messageDate = new Date(message.createdAt);

    const recipients = message.recipients;
    messageDate.setHours(0, 0, 0, 0);

    for (let recipient of recipients) {
      if (
        message.sender._id.equals(user._id) ||
        (recipient.user.equals(user._id) && !recipient.isDeleted)
      ) {
        if (!recipient.isRead) {
          unreadMessageCount++;
        }
        const formattedDate = messageDate.toLocaleDateString("en-GB");
        if (!categorizedMessages[formattedDate]) {
          categorizedMessages[formattedDate] = [];
        }
        categorizedMessages[formattedDate].push(message);
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
    messages: categorizedMessages,
    unreadMessageCount,
  };

  res.status(200).json({
    success: true,
    conversation: conversationsWithUnreadCount,
  });
});

export default getConversation;
