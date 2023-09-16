import asyncHandler from "../../utils/asyncHandler.js";

/********************************************************
 * @GET_PROFILE
 * @METHOD GET
 * @route /api/user/profile
 * @description Send the req.user
 * @parameters none
 * @return User object
 *********************************************************/

const getProfile = asyncHandler(async (req, res) => {
  const { user } = req;

  res.status(200).json({
    success: true,
    user,
  });
});

export default getProfile;
