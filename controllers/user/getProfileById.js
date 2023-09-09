import asyncHandler from "../../utils/asyncHandler.js";
import CustomError from "../../utils/CustomError.js";
import User from "../../schemas/user.schema.js";

/********************************************************
 * @GET_PROFILE_BY_ID
 * @METHOD GET
 * @route /api/user/profile/:userId
 * @description Check for req.user and identify if user is owner or not and send profile
 * @parameters userId
 * @return User object
 *********************************************************/

const getProfileById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId)
    .populate("friends", "name profilePicture username")
    .exec();

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  let isOwner = false;

  if (user._id.equals(req.user._id)) {
    isOwner = true;
  }

  res.status(200).json({
    success: true,
    isOwner,
    user,
  });
});

export default getProfileById;
