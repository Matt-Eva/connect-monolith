const express = require("express");
const router = express.Router();

const authController = require("./controllers/authController.js");
const userController = require("./controllers/userController.js");
const chatController = require("./controllers/chatController.js");
const connectionController = require("./controllers/connectionController.js");
const invitationController = require("./controllers/invitationController.js");

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

router.delete("/leave-chat/:chatId", chatController.leaveChat);

router.get("/my-connections", connectionController.getConnections);

router.get("/search-connections/:name", connectionController.search);

router.delete(
  "/delete-connection/:connectionId",
  connectionController.deleteConnection,
);

router.get("/my-invitations", invitationController.getInvitations);

router.post("/invite-connection", invitationController.createInvitation);

module.exports = router;
