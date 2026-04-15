const express = require("express");
const router = express.Router();

const adminProtect = require("../middleware/adminAuthMiddleware");
const {
  getAllBuddiesForAdmin,
  getSingleBuddyForAdmin,
  verifyBuddy,
  rejectBuddy,
} = require("../controllers/adminBuddyController");

router.get("/buddies", adminProtect, getAllBuddiesForAdmin);
router.get("/buddies/:id", adminProtect, getSingleBuddyForAdmin);
router.patch("/buddies/:id/verify", adminProtect, verifyBuddy);
router.patch("/buddies/:id/reject", adminProtect, rejectBuddy);

module.exports = router;
