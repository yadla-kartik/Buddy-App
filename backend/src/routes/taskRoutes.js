const express = require("express");
const router = express.Router();

const {
  createTask,
  getAllPendingTasks,
  acceptTask,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");
const buddyProtect = require("../middleware/buddyAuthMiddleware");

// USER
router.post("/create", protect, createTask);

// BUDDY
router.get("/pending", buddyProtect, getAllPendingTasks);
router.post("/accept/:taskId", buddyProtect, acceptTask);

module.exports = router;
