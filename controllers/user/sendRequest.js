import asyncHandler from "../../utils/asyncHandler.js";
import CustomError from "../../utils/CustomError.js";
import User from "../../schemas/user.schema.js";

/********************************************************
 * @SEND_REQUEST
 * @METHOD PATCH
 * @route /api/user/request/send/:userId
 * @description Send friend request controller to send friend request to specified user.
 * @parameters User id (To which we have to send request)
 * @return sender and receiver object
 *********************************************************/

const sendRequest = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (req.user._id.equals(userId)) {
    throw new CustomError("You can't send friend request to yourself", 404);
  }

  if (req.user.friends.includes(userId)) {
    throw new CustomError("Already friend", 409);
  }

  if (req.user.sentFriendRequests.includes(userId)) {
    throw new CustomError("You already sent the request", 409);
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  user.receivedFriendRequests.push(req.user._id);
  req.user.sentFriendRequests.push(user._id);

  await user.save();
  await req.user.save();

  res.status(200).json({
    success: true,
    message: "Friend Request Sent Successfully",
    user: req.user,
  });
});

export default sendRequest;
