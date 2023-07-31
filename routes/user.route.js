import express from "express";
import controllers from "../controllers/index.js";
import middlewares from "../middlewares/index.js";

const router = express.Router();

router.get(
  "/profile/:userId",
  middlewares.isLoggedIn,
  controllers.getProfileById
);
router.get(
  "/friends/:userId",
  middlewares.isLoggedIn,
  controllers.getFriendsById
);
router.patch(
  "/request/sent/:userId",
  middlewares.isLoggedIn,
  controllers.sendRequest
);
router.patch(
  "/request/accept/:userId",
  middlewares.isLoggedIn,
  controllers.acceptFriendRequest
);
router.get("/request/sent", middlewares.isLoggedIn, controllers.getSentRequests);
router.get(
  "/request/received",
  middlewares.isLoggedIn,
  controllers.getReceivedRequests
);
router.patch(
  "/profile/update",
  middlewares.isLoggedIn,
  controllers.updateProfile
);
router.patch("/status/update", middlewares.isLoggedIn, controllers.updateStatus);
router.patch(
  "/password/update",
  middlewares.isLoggedIn,
  controllers.updatePassword
);

export default router;
