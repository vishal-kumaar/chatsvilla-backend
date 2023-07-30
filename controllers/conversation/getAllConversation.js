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
    .populate("lastMessage")
    .exec();

  res.status(200).json({
    success: true,
    conversations,
  });
});

export default getAllConversations;
