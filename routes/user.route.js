import express from "express";
import controllers from "../controllers/index.js";
import middlwares from "../middlewares/index.js";

const router = express.Router();

router.get(
  "/profile/:userId",
  middlwares.isLoggedIn,
  controllers.getProfileById
);
router.get(
  "/friends/:userId",
  middlwares.isLoggedIn,
  controllers.getFriendsById
);
router.patch(
  "/request/sent/:userId",
  middlwares.isLoggedIn,
  controllers.sendRequest
);
router.get("/request/sent", middlwares.isLoggedIn, controllers.getSentRequests);
router.get(
  "/request/received",
  middlwares.isLoggedIn,
  controllers.getReceivedRequests
);
router.patch(
  "/profile/update",
  middlwares.isLoggedIn,
  controllers.updateProfile
);
router.patch("/status/update", middlwares.isLoggedIn, controllers.updateStatus);
router.patch(
  "/password/update",
  middlwares.isLoggedIn,
  controllers.updatePassword
);

export default router;
