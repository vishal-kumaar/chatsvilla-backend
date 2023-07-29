import asyncHandler from "../../utils/asyncHandler.js";
import CustomError from "../../utils/CustomError.js";
import Message from "../../schemas/message.schema.js";
import Conversation from "../../schemas/conversation.schema.js";

/********************************************************
 * @DELETE_MESSAGE
 * @METHOD DELETE
 * @route /api/messages/:messageId
 * @description Delete a message
 * @parameters messageId (in URL)
 * @return deleted message object
 *********************************************************/

const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  const foundMessage = await Message.findById(messageId);

  if (!foundMessage) {
    throw new CustomError("Message not found", 404);
  }

  if (foundMessage.sender.equals(userId)) {
    await Message.findByIdAndDelete(messageId);
    await Conversation.findByIdAndUpdate(foundMessage.conversation, {
      $pull: { messages: messageId },
    });
  } else {
    const matchingRecipientIndex = foundMessage.recipients.findIndex(
      (recipient) => recipient.user.equals(userId)
    );

    if (matchingRecipientIndex === -1) {
      throw new CustomError("You are not the sender of this message", 403);
    }

    foundMessage.recipients[matchingRecipientIndex].isDeleted = true;
    await foundMessage.save();
  }

  res.status(200).json({
    success: true,
    message: foundMessage,
  });
});

export default deleteMessage;
