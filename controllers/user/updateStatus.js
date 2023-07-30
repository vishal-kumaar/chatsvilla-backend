import asyncHandler from "../../utils/asyncHandler.js";
import CustomError from "../../utils/CustomError.js";

/********************************************************
 * @UPDATE_STATUS
 * @METHOD PATCH
 * @route /api/user/status/update
 * @description Update user online status and last seen timestamp
 * @parameters online (Boolean)
 * @return updated user object
 *********************************************************/

const updateStatus = asyncHandler(async (req, res) => {
  const { online } = req.body;

  if (typeof online !== "boolean") {
    throw new CustomError("Invalid value for online status", 400);
  }

  req.user.online = online;
  if (!online) {
    req.user.lastSeen = new Date();
  }

  await req.user.save();

  res.status(200).json({
    success: true,
    message: "Status Updated Successfully",
    user: req.user,
  });
});

export default updateStatus;
