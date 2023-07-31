import asyncHandler from "../../utils/asyncHandler.js";
import CustomError from "../../utils/CustomError.js";
import User from "../../schemas/user.schema.js";

/********************************************************
 * @ACCEPT_FRIEND_REQUEST
 * @METHOD PATCH
 * @route /api/user/request/accept/:userId
 * @description Accept a friend request from a user with the given userId
 * @parameters userId (in URL)
 * @return updated user object with accepted friend
 *********************************************************/

const acceptFriendRequest = asyncHandler(async (req, res) => {
  const { user } = req;
  const { userId } = req.params;

  const friendRequestSender = await User.findById(userId);

  if (!friendRequestSender) {
    throw new CustomError("Friend request sender not found", 404);
  }

  const hasFriendRequest = user.receivedFriendRequests.includes(userId);
  if (!hasFriendRequest) {
    throw new CustomError("No pending friend request from this user", 404);
  }

  user.friends.push(friendRequestSender);
  friendRequestSender.friends.push(userId);
  await user.save();

  user.receivedFriendRequests = user.receivedFriendRequests.filter(
    (requestId) => requestId.toString() !== userId
  );
  await user.save();

  friendRequestSender.sentFriendRequests = friendRequestSender.sentFriendRequests.filter(
    (requestId) => requestId.toString() !== user._id.toString()
  );
  await friendRequestSender.save();

  res.status(200).json({
    success: true,
    message: "Friend request accepted successfully",
    user,
  });
});

export default acceptFriendRequest;
