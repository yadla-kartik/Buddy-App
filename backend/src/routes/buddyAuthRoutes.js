const express = require("express");
const router = express.Router();
const { registerBuddy, loginBuddy, getBuddyStatus } = require("../controllers/buddyAuthController");
const upload = require("../middleware/multer");
const buddyAuth = require("../middleware/buddyAuthMiddleware");

// Register route with proper field names
router.post(
  "/auth/register",
  upload.fields([
    { name: "panImage", maxCount: 1 },
    { name: "aadhaarImage", maxCount: 1 },
    { name: "profilePhoto", maxCount: 1 },
  ]),
  registerBuddy
);

// Login route
router.post("/auth/login", loginBuddy);

// ✅ NEW: Get buddy status (protected route)
router.get("/auth/status", buddyAuth, getBuddyStatus);

module.exports = router;