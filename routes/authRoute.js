const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");

// Route for displaying the login form
router.get("/login", authController.login);

// Route for handling login form submission
router.post("/login", authController.loginSubmit);

// Route for displaying the registration form
router.get("/register", authController.register);

// Route for handling registration form submission
router.post("/register", authController.registerSubmit);

// Add other authentication routes as needed

module.exports = router;
