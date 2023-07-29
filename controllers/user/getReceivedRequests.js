import asyncHandler from "../../utils/asyncHandler.js";

/********************************************************
 * @GET_RECEIVED_REQUESTS
 * @METHOD GET
 * @route /api/user/request/received
 * @description Check for req.user and get the list of friend received requests
 * @parameters none
 * @return receivedRequests object
 *********************************************************/

const getReceivedRequests = asyncHandler(async (req, res) => {
  const { user } = req;

  const populatedUser = await user
    .populate("receivedFriendRequests", "name profilePicture username")
    .execPopulate();
  const receivedRequests = populatedUser.receivedFriendRequests;

  res.status(200).json({
    success: true,
    receivedRequests,
  });
});

export default getReceivedRequests;
