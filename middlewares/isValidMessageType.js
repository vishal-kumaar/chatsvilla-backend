import asyncHandler from "../utils/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import { messageTypeEnum } from "../utils/enums.js";

const isValidMessageType = asyncHandler(async (req, _res, next) => {
  const { message, messageType } = req.body;

  if (!message) {
    throw new CustomError("Message is required", 400);
  }

  if (!messageTypeEnum.includes(messageType)) {
    throw new CustomError("Message type is unsupported", 404);
  }

  next();
});

export default isValidMessageType;
