import asyncHandler from "../../utils/asyncHandler.js";
import Conversation from "../../schemas/conversation.schema.js";

/********************************************************
 * @GET_ALL_CONVERSATIONS
 * @METHOD GET
 * @route /api/conversation
 * @description Get all conversations
 * @return array of conversation objects
 *********************S************************************/

const getAllConversations = asyncHandler(async (req, res) => {
  const { user } = req;

  const conversations = await Conversation.find({
    "participants.user": user._id,
    "participants.isDeleted": false,
  })
    .populate("participants.user", "name profilePic email online")
    .populate("messages")
    .exec();

  const conversationsWithUnreadCount = conversations.map((conversation) => {
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

    const lastMessage = filterMessage[filterMessage.length - 1];
    conversation.messages = undefined;

    return {
      ...conversation.toObject(),
      lastMessage: lastMessage,
      unreadMessageCount,
    };
  });

  res.status(200).json({
    success: true,
    conversations: conversationsWithUnreadCount,
  });
});

export default getAllConversations;
