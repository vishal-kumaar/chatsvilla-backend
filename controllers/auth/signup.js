import crypto from "crypto";
import asyncHandler from "../../utils/asyncHandler.js";
import CustomError from "../../utils/CustomError.js";
import User from "../../schemas/user.schema.js";
import { genderEnum } from "../../utils/enums.js";

/********************************************************
 * @SIGNUP
 * @method POST
 * @route /api/auth/signup
 * @description User signup controller for creating a new user
 * @parameters name, username, email, password
 * @return User Object
 *********************************************************/

const sigup = asyncHandler(async (req, res) => {
  const { name, username, email, gender, password } = req.body;

  if (!name || !username || !email || !gender || !password) {
    throw new CustomError("All fields are required", 400);
  }

  if (!genderEnum.includes(gender)) {
    throw new CustomError("Invalid gender value", 400);
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new CustomError("User already exists", 409);
  }

  const existingUsername = await User.findOne({ username });

  if (existingUsername) {
    throw new CustomError("Username already exists", 409);
  }

  const { publicKey, privateKey } = await crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  const user = await User.create({
    name,
    username,
    email,
    password,
    publicKey,
    privateKey,
  });

  const token = user.getUserToken();
  user.password = undefined;
  user.publicKey = undefined;
  user.privateKey = undefined;

  return res.status(200).json({
    success: true,
    message: "User created successfully",
    token,
    user,
  });
});

export default sigup;
