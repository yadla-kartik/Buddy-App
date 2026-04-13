const express = require("express");
const router = express.Router();
const {
  signupBuddy,
  registerBuddy,
  loginBuddy,
  getBuddyStatus,
  logoutBuddy,
} = require("../controllers/buddyAuthController");
const upload = require("../middleware/multer");
const buddyAuth = require("../middleware/buddyAuthMiddleware");

// Signup route
router.post("/auth/signup", signupBuddy);

// Registration form submit route (protected)
router.post(
  "/auth/register",
  buddyAuth,
  upload.fields([
    { name: "panImage", maxCount: 1 },
    { name: "aadhaarImage", maxCount: 1 },
    { name: "profilePhoto", maxCount: 1 },
    { name: "drivingLicenseImage", maxCount: 1 },
  ]),
  registerBuddy
);

// Login route
router.post("/auth/login", loginBuddy);

// Get buddy status (protected route)
router.get("/auth/status", buddyAuth, getBuddyStatus);

// Logout route
router.post("/auth/logout", logoutBuddy);

module.exports = router;
