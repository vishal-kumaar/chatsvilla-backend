import asyncHandler from "../../utils/asyncHandler.js";
import CustomError from "../../utils/CustomError.js";
import User from "../../schemas/user.schema.js";

/********************************************************
 * @GET_FRIENDS_BY_ID
 * @METHOD GET
 * @route /api/user/friends:userId
 * @description get friends by id controller to get the friends list by user id
 * @parameters userId
 * @return friends object
 *********************************************************/

const getFriendsId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const populatedUser = await user
    .populate("friends", "name profilePicture username")
    .execPopulate();
  const friends = populatedUser.friends;

  res.status(200).json({
    success: true,
    friends,
  });
});

export default getFriendsId;
