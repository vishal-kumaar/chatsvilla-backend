import asyncHandler from "../../utils/asyncHandler.js";
import CustomError from "../../utils/CustomError.js";
import User from "../../schemas/user.schema.js";

/********************************************************
 * @LOGIN
 * @method POST
 * @route /api/auth/login
 * @description User login controller for login a user
 * @parameters username/email, password
 * @return User Object
 *********************************************************/

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new CustomError("Username/Email and password are required", 400);
  }

  const user = await User.findOne({
    $or: [{ username }, { email: username }],
  }).select("+password");

  if (!user) {
    throw new CustomError("Invalid credentials", 401);
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new CustomError("Invalid credentials", 401);
  }

  const token = user.getJwtToken();
  user.password = undefined;

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user,
  });
});

export default login;
