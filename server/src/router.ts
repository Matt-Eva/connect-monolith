import express from "express";
const router = express.Router();

const authController = require("./controllers/authController.js");
const userController = require("./controllers/userController.js");
const chatController = require("./controllers/chatController.js");
const connectionController = require("./controllers/connectionController.js");
const invitationController = require("./controllers/invitationController.js");
const blockedUserController = require("./controllers/blockedUserController.js");
const postController = require("./controllers/postController");

router.post("/login", authController.login);

router.delete("/logout", authController.logout);

router.get("/me", authController.me);

router.get("/user/:id", userController.getUser);

router.post("/new-account", userController.createUser);

router.patch("/my-account", userController.updateUser);

router.delete("/my-account", userController.deleteUser);

router.patch("/update-password", userController.updatePassword);

router.get("/my-chats", chatController.getChats);

router.post("/new-chat", chatController.createChat);

router.patch("/update-read/:chatId", chatController.updateRead);

router.delete("/leave-chat/:chatId", chatController.leaveChat);

router.get("/my-connections", connectionController.getConnections);

router.get("/search-connections/:name", connectionController.search);

router.delete(
  "/delete-connection/:connectionId",
  connectionController.deleteConnection,
);

router.get("/my-invitations", invitationController.getInvitations);

router.post("/invite-connection", invitationController.createInvitation);

router.post("/accept-invitation", invitationController.acceptInvitation);

router.post("/ignore-invitation", invitationController.ignoreInvitation);

router.post("/block-user", blockedUserController.blockUser);

router.get("/blocked-users", blockedUserController.loadBlockedUsers);

router.delete("/unblock-user/:userId", blockedUserController.unblockUser);

router.post("/post-draft", postController.savePostDraft);

export default router;
