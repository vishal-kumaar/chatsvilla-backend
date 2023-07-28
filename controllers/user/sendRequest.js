import asyncHandler from "../../utils/asyncHandler.js";
import CustomError from "../../utils/CustomError.js";
import User from "../../schemas/user.schema.js";

/********************************************************
 * @SEND_REQUEST
 * @METHOD PATCH
 * @route /api/user/request/sent/:userId
 * @description Send friend request controller to send friend request to specified user.
 * @parameters User id (To which we have to send request)
 * @return sender and receiver object
 *********************************************************/

const sendRequest = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  user.receivedFriendRequests.push(req.user._id);
  req.user.sentFriendRequests.push(user._id);

  res.status(200).json({
    success: true,
    message: "Friend Request Sent Successfully",
    sender: req.user,
    receiver: user,
  });
});

export default sendRequest;
