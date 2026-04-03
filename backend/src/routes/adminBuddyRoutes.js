const express = require("express");
const router = express.Router();

const adminProtect = require("../middleware/adminAuthMiddleware");
const {
  getAllBuddiesForAdmin,
  getSingleBuddyForAdmin,
  verifyBuddy,
} = require("../controllers/adminBuddyController");

// ✅ LIST (name + email)
router.get("/buddies", adminProtect, getAllBuddiesForAdmin);

// ✅ SINGLE (full data)
router.get("/buddies/:id", adminProtect, getSingleBuddyForAdmin);

// ✅ VERIFY
router.patch("/buddies/:id/verify", adminProtect, verifyBuddy);

module.exports = router;
