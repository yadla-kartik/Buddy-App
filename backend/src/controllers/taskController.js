const Task = require("../models/Task");

// CREATE TASK (existing)
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      user: req.user._id, // 🔗 LOGIN USER

      parentName: req.body.parentName,
      parentMobile: req.body.parentMobile,
      parentCurrentLocation: req.body.parentCurrentLocation,

      taskLocationType: req.body.taskLocationType,
      taskLocationDescription: req.body.taskLocationDescription,

      taskType: req.body.taskType,
      taskDescription: req.body.taskDescription,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ NEW: GET ALL PENDING TASKS (for Buddy Dashboard)
exports.getAllPendingTasks = async (req, res) => {
  try {
    // Get all tasks that are pending and not assigned to any buddy
    const tasks = await Task.find({
      status: "pending",
      assignedBuddy: null,
    })
      .populate("user", "name email mobile") // Include user details
      .sort({ createdAt: -1 }); // Latest first

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (err) {
    console.error("❌ GET TASKS ERROR =>", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ NEW: ACCEPT TASK (Buddy accepts a task)
exports.acceptTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const buddyId = req.buddy.id; // From buddyAuth middleware

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.status !== "pending" || task.assignedBuddy) {
      return res.status(400).json({ message: "Task is no longer available" });
    }

    // Assign buddy and update status
    task.assignedBuddy = buddyId;
    task.status = "accepted";
    await task.save();

    res.status(200).json({
      message: "Task accepted successfully",
      task,
    });
  } catch (err) {
    console.error("❌ ACCEPT TASK ERROR =>", err);
    res.status(500).json({ message: err.message });
  }
};