import asyncHandler from "../../utils/asyncHandler.js";

/********************************************************
 * @GET_SENT_REQUESTS
 * @METHOD GET
 * @route /api/user/request/sent
 * @description Check for req.user and get the list of friend sent requests
 * @parameters none
 * @return sentRequests object
 *********************************************************/

const sentFriendRequests = asyncHandler(async (req, res) => {
  const { user } = req;

  const populatedUser = await user
    .populate("sentFriendRequests", "name profilePicture username")
    .execPopulate();
  const sentRequests = populatedUser.sentFriendRequests;

  res.status(200).json({
    success: true,
    sentRequests,
  });
});

export default sentFriendRequests;
