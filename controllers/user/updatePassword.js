import asyncHandler from "../../utils/asyncHandler.js";
import CustomError from "../../utils/CustomError.js";
import User from "../../schemas/user.schema.js";

/********************************************************
 * @UPDATE_PASSWORD
 * @METHOD PATCH
 * @route /api/user/password/update
 * @description Check for req.user and update the user password
 * @parameters old password, new password and confirm new password
 * @return user object
 *********************************************************/

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmNewPassword) {
    throw new CustomError("All fields are required", 400);
  }

  if (newPassword !== confirmNewPassword) {
    throw new CustomError("New and Confirm Password both must be same", 400);
  }

  const user = await User.findById(req.user._id).select("+password");

  const isPasswordMatch = await user.comparePassword(oldPassword);

  if (!isPasswordMatch) {
    throw new CustomError("Incorrect old password", 400);
  }

  user.set({ password: newPassword });
  await user.save();

  user.password = undefined;

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    user,
  });
});

export default updatePassword;
