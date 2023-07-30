import signup from "./auth/signup.js";
import login from "./auth/login.js";
import getProfileById from "./user/getProfileById.js";
import getFriendsById from "./user/getFriendsById.js";
import sendRequest from "./user/sendRequest.js";
import getSentRequests from "./user/getSentRequests.js";
import getReceivedRequests from "./user/getReceivedRequests.js";
import updateProfile from "./user/updateProfile.js";
import updateStatus from "./user/updateStatus.js";
import updatePassword from "./user/updatePassword.js";
import sendMessage from "./message/sendMessage.js";
import deleteMessage from "./message/deleteMessage.js";
import getConversation from "./conversation/getConversation.js";
import getAllConversations from "./conversation/getAllConversation.js";
import markConversationAsRead from "./conversation/markConversationAsRead.js";
import deleteConversation from "./conversation/deleteConversation.js";

const controllers = {
  signup,
  login,
  getProfileById,
  getFriendsById,
  sendRequest,
  getSentRequests,
  getReceivedRequests,
  updateProfile,
  updateStatus,
  updatePassword,
  sendMessage,
  deleteMessage,
  getConversation,
  getAllConversations,
  markConversationAsRead,
  deleteConversation,
};

export default controllers;
