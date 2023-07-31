import asyncHandler from "../../utils/asyncHandler.js";
import Conversation from "../../schemas/conversation.schema.js";

/********************************************************
 * @GET_ALL_CONVERSATIONS
 * @METHOD GET
 * @route /api/conversation
 * @description Get all conversations
 * @return array of conversation objects
 *********************************************************/

const getAllConversations = asyncHandler(async (req, res) => {
  const { user } = req;

  const conversations = await Conversation.find({
    "participants.user": user._id,
    "participants.isDeleted": false,
  })
    .populate({
      path: "participants.user",
      select: "name profilePic email",
    })
    .populate({
      path: "messages",
      match: {
        $or: [
          { sender: user._id },
          { "recipients.user": user._id, "recipients.isDeleted": false },
        ],
      },
    })
    .exec();

  const conversationsWithUnreadCount = conversations.map((conversation) => {
    const unreadMessageCount = conversation.messages.reduce(
      (count, message) => {
        let isRead = false;
        const isRecipient = message.recipients.some((recipient) => {
          isRead = recipient.isRead;
          return recipient.user.equals(user._id);
        });
        if (isRecipient && !isRead) {
          count += 1;
        }
        return count;
      },
      0
    );

    return {
      ...conversation.toObject(),
      unreadMessageCount,
    };
  });

  res.status(200).json({
    success: true,
    conversations: conversationsWithUnreadCount,
  });
});

export default getAllConversations;
