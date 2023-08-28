import asyncHandler from "../../utils/asyncHandler.js";
import User from "../../schemas/user.schema.js";

/********************************************************
 * @GET_RECEIVED_REQUESTS
 * @METHOD GET
 * @route /api/user/requests/received
 * @description Check for req.user and get the list of friend received requests
 * @parameters none
 * @return receivedRequests object
 *********************************************************/

const getReceivedRequests = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate(
      "receivedFriendRequests",
      "name profilePicture username email gender"
    )
    .exec();
  const receivedRequests = user.receivedFriendRequests;

  res.status(200).json({
    success: true,
    receivedRequests,
  });
});

export default getReceivedRequests;
