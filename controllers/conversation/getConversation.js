import asyncHandler from "../../utils/asyncHandler.js";
import CustomError from "../../utils/CustomError.js";
import Conversation from "../../schemas/conversation.schema.js";

/********************************************************
 * @GET_CONVERSATION
 * @METHOD GET
 * @route /api/conversation/:conversationId
 * @description Get details of a specific conversation
 * @parameters conversationId (in URL)
 * @return conversation object
 *********************************************************/

const getConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { user } = req;

  const conversation = await Conversation.findById(conversationId)
    .populate("participants.user", "name profilePic email")
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

  if (!conversation) {
    throw new CustomError("Conversation not found", 404);
  }

  const isParticipant = conversation.participants.some((participant) => {
    if (participant.user.equals(user._id)) {
      isDeleted = participant.isDeleted;
      return true;
    } else {
      return false;
    }
  });

  if (!isParticipant) {
    throw new CustomError(
      "You are not a participant in this conversation",
      403
    );
  }

  if (isDeleted) {
    throw new CustomError("Conversation has been deleted", 404);
  }

  const unreadMessageCount = conversation.messages.reduce((count, message) => {
    const isRecipient = message.recipients.some((recipient) =>
      recipient.user.equals(user._id)
    );
    if (isRecipient && !message.isRead) {
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
