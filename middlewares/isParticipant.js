import asyncHandler from "../utils/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import Conversation from "../schemas/conversation.schema.js";

const isParticipant = asyncHandler(async (req, _res, next) => {
  const { conversationId } = req.params;
  const user = req.user;
  const conversation = await Conversation.findById(conversationId)
    .populate("participants.user", "name profilePic email online lastSeen")
    .populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "name username profilePic",
      },
    })
    .exec();

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

  req.user = user;
  req.conversation = conversation;

  next();
});

export default isParticipant;
