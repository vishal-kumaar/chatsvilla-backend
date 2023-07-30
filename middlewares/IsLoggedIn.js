import asyncHandler from "../utils/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import User from "../schemas/user.schema.js";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

const isLoggedIn = asyncHandler(async (req, _res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new CustomError("Not authorized to access this route", 401);
  }

  try {
    const decodedJwtPayload = jwt.verify(token, config.jwtSecret);
    console.log(decodedJwtPayload)
    req.user = await User.findById(decodedJwtPayload._id);
    next();
  } catch (error) {
    throw new CustomError("Session expired! Login to continue", 401);
  }
});

export default isLoggedIn;