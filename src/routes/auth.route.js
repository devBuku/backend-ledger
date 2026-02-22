const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");

router.post("/register", authController.registerUserController);

router.post("/login", authController.loginUserController);

module.exports = router;
