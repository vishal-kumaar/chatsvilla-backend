import asyncHandler from "../../utils/asyncHandler.js";
// import CustomError from "../../utils/CustomError.js";
import User from "../../schemas/user.schema.js";

/********************************************************
 * @GET_FRIENDS
 * @METHOD GET
 * @route /api/user/friends
 * @description Get the list of friends for the authenticated user
 * @return array of user objects representing friends
 *********************************************************/

const getFriends = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("friends", "name profilePic username email")
    .exec();

  const friends = user.friends;

  res.status(200).json({
    success: true,
    message: "List of friends",
    friends,
  });
});

export default getFriends;
