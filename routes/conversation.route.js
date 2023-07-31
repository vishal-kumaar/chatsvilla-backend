import express from "express";
import controllers from "../controllers/index.js";
import middlewares from "../middlewares/index.js";

const router = express.Router();

router.post(
  "/:conversationId/message",
  middlewares.isLoggedIn,
  controllers.sendMessage
);
router.delete(
  "/message/:messageId",
  middlewares.isLoggedIn,
  controllers.deleteMessage
);
router.get(
  "/:conversationId",
  [middlewares.isLoggedIn, middlewares.isParticipant],
  controllers.getConversation
);
router.get("/", middlewares.isLoggedIn, controllers.getAllConversations);
router.patch(
  "/:conversationId/read",
  middlewares.isLoggedIn,
  controllers.markConversationAsRead
);
router.delete(
  "/:conversationId",
  [middlewares.isLoggedIn, middlewares.isParticipant],
  controllers.deleteConversation
);

export default router;
