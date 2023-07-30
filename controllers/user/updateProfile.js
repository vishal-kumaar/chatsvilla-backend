import asyncHandler from "../../utils/asyncHandler.js";
import CustomError from "../../utils/CustomError.js";
import User from "../../schemas/user.schema.js";

/********************************************************
 * @UPDATE_PROFIlE
 * @METHOD PATCH
 * @route /api/user/profile/update
 * @description Check for req.user and update the user profile
 * @parameters name, username, gender, bio
 * @return user object
 *********************************************************/

const updateProfile = asyncHandler(async (req, res) => {
  const { user } = req;
  const { name, username, gender, bio } = req.body;

  if (!name || !username) {
    throw new CustomError("Name and username are required", 400);
  }

  const existingUsername = await User.findOne({
    username,
    _id: { $ne: user._id },
  });

  if (existingUsername) {
    throw new CustomError(
      "Username already exists, Try different username",
      409
    );
  }

  user.name = name;
  user.username = username;
    user.gender = gender;
  user.bio = bio;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    user,
  });
});

export default updateProfile;
