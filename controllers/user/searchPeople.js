import asyncHandler from "../../utils/asyncHandler.js";
import User from "../../schemas/user.schema.js";

/********************************************************
 * @SEARCH_PEOPLE
 * @METHOD GET
 * @route /api/user/search
 * @description Search for people by their username or name
 * @parameters query (search query in the request query string)
 * @return array of user objects matching the search query
 *********************************************************/

const searchPeople = asyncHandler(async (req, res) => {
  const { query } = req.query;

  let searchResults;
  if (query) {
    searchResults = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    }).select("name username profilePic bio");
  } else {
    searchResults = [];
  }

  res.status(200).json({
    success: true,
    message: "Search results for people",
    results: searchResults,
  });
});

export default searchPeople;
