const express = require("express");
const router = express.Router();
const reminderController = require("../controllers/reminder_controller");
const { ensureAuthenticated } = require("../middleware/auth_middleware"); // Import authentication middleware

// Route for displaying the list of reminders (requires authentication)
router.get("/", ensureAuthenticated, reminderController.list);

// Route for displaying the new reminder form (requires authentication)
router.get("/new", ensureAuthenticated, reminderController.new);

// Route for displaying a single reminder (requires authentication)
router.get("/:id", ensureAuthenticated, reminderController.listOne);

// Route for displaying the edit reminder form (requires authentication)
router.get("/:id/edit", ensureAuthenticated, reminderController.edit);

// Route for handling reminder creation (requires authentication)
router.post("/", ensureAuthenticated, reminderController.create);

// Route for handling reminder updates (requires authentication)
router.post("/update/:id", ensureAuthenticated, reminderController.update);

// Route for handling reminder deletion (requires authentication)
router.post("/delete/:id", ensureAuthenticated, reminderController.delete);

module.exports = router;
