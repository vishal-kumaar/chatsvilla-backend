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
    .populate("lastMessage")
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

    let participantUser = undefined;
    if (conversation.type === "Individual") {
      for (let participant of conversation.participants) {
        if (!participant.user._id.equals(user._id)) {
          participantUser = participant;
        }
      }
      conversation.participants = undefined;
    }

    conversation.messages = undefined;

    return {
      participant: participantUser,
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
