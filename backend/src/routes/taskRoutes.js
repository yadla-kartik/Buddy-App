const express = require("express");
const router = express.Router();

const {
  createTask,
  getAllPendingTasks,
  getBuddyTasks,
  getUserTasks,
  acceptTask,
  rejectTask,
  completeTask,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");
const buddyProtect = require("../middleware/buddyAuthMiddleware");

// USER
router.post("/create", protect, createTask);
router.get("/user", protect, getUserTasks);

// BUDDY
router.get("/pending", buddyProtect, getAllPendingTasks);
router.get("/buddy/my", buddyProtect, getBuddyTasks);
router.post("/accept/:taskId", buddyProtect, acceptTask);
router.post("/reject/:taskId", buddyProtect, rejectTask);
router.post("/complete/:taskId", buddyProtect, completeTask);

module.exports = router;
