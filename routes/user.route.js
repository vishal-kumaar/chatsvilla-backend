import express from "express";
import controllers from "../controllers/index.js";
import middlewares from "../middlewares/index.js";

const router = express.Router();

router.get("/search", middlewares.isLoggedIn, controllers.searchPeople);
router.get("/profile", middlewares.isLoggedIn, controllers.getProfile);
router.get(
  "/profile/:userId",
  middlewares.isLoggedIn,
  controllers.getProfileById
);
router.get("/friends", middlewares.isLoggedIn, controllers.getFriends);
router.get(
  "/friends/:userId",
  middlewares.isLoggedIn,
  controllers.getFriendsById
);
router.get(
  "/friends/:userId/mutual",
  middlewares.isLoggedIn,
  controllers.mutualFriends
);
router.patch(
  "/request/send/:userId",
  middlewares.isLoggedIn,
  controllers.sendRequest
);
router.patch(
  "/request/accept/:userId",
  middlewares.isLoggedIn,
  controllers.acceptFriendRequest
);
router.get(
  "/requests/sent",
  middlewares.isLoggedIn,
  controllers.getSentRequests
);
router.get(
  "/requests/received",
  middlewares.isLoggedIn,
  controllers.getReceivedRequests
);
router.patch(
  "/profile/update",
  middlewares.isLoggedIn,
  controllers.updateProfile
);
router.patch(
  "/status/update",
  middlewares.isLoggedIn,
  controllers.updateStatus
);
router.patch(
  "/password/update",
  middlewares.isLoggedIn,
  controllers.updatePassword
);

export default router;
