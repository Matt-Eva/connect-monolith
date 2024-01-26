const express = require("express");
const router = express.Router();

const authController = require("./controllers/authController.js");
const userController = require("./controllers/userController.js");
const chatController = require("./controllers/chatController.js");

router.post("/login", authController.login);

router.delete("/logout", authController.logout);

router.get("/me", authController.me);

router.post("/new-account", userController.createUser);

router.patch("/my-account", userController.updateUser);

router.delete("/my-account", userController.deleteUser);

router.patch("/update-password", userController.updatePassword);

router.get("/my-chats", chatController.getChats);

module.exports = router;
