import asyncHandler from "../../utils/asyncHandler.js";
import User from "../../schemas/user.schema.js";

/********************************************************
 * @GET_SENT_REQUESTS
 * @METHOD GET
 * @route /api/user/requests/sent
 * @description Check for req.user and get the list of friend sent requests
 * @parameters none
 * @return sentRequests object
 *********************************************************/

const sentFriendRequests = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("sentFriendRequests", "name profilePicture username email gender")
    .exec();
  const sentRequests = user.sentFriendRequests;

  res.status(200).json({
    success: true,
    sentRequests,
  });
});

export default sentFriendRequests;
