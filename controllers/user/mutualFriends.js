import asyncHandler from "../../utils/asyncHandler.js";
import CustomError from "../../utils/CustomError.js";
import User from "../../schemas/user.schema.js";

/********************************************************
 * @MUTUAL_FRIENDS
 * @METHOD GET
 * @route /api/user/friends/:userId/mutual
 * @description Get the list of mutual friends of the authenticated user
 * @return array of user objects representing mutual friends
 *********************************************************/

const mutualFriends = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId)
    .populate("friends", "name profilePic username email")
    .exec();

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const mutualFriends = user.friends.filter((friend) =>
    req.user.friends.includes(friend._id)
  );

  res.status(200).json({
    success: true,
    message: "Mutual friends found",
    mutualFriends,
  });
});

export default mutualFriends;
