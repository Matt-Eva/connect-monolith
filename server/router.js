const express = require("express");
const router = express.Router();

const authController = require("./controllers/authController.js");
const userController = require("./controllers/userController.js");

router.post("/login", authController.login);

router.delete("/logout", authController.logout);

router.get("/me", authController.me);

router.post("/new-account", userController.createUser);

module.exports = router;
