import asyncHandler from "../../utils/asyncHandler.js";
import CustomError from "../../utils/CustomError.js";
import Message from "../../schemas/message.schema.js";

/********************************************************
 * @EDIT_MESSAGE
 * @METHOD PUT
 * @route /api/messages/:messageId
 * @description Edit a message
 * @parameters messageId (in URL)
 * @body message (in request body)
 * @return edited message object
 *********************************************************/

const editMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { message } = req.body;
  const userId = req.user._id;

  if (!message) {
    throw new CustomError("Message is required", 400);
  }

  const foundMessage = await Message.findById(messageId);

  if (!foundMessage) {
    throw new CustomError("Message not found", 404);
  }

  if (!foundMessage.sender.equals(userId)) {
    throw new CustomError("You are not the sender of this message", 403);
  }

  foundMessage.message = message;
  await foundMessage.save();

  res.status(200).json({
    success: true,
    message: foundMessage,
  });
});

export default editMessage;
