const Task = require("../models/Task");
const { notifyNearbyBuddies } = require("../socket");

exports.createTask = async (req, res) => {
  try {
    const taskLatitude = Number(req.body.taskLatitude);
    const taskLongitude = Number(req.body.taskLongitude);
    const priceByTaskType = {
      need_help: 200,
      pickup_drop: 250,
      document_work: 300,
      hospital_visit: 400,
      walk: 180,
      others: 220,
    };
    const taskType = req.body.taskType;
    const taskPrice = priceByTaskType[taskType] || 220;

    if (
      !Number.isFinite(taskLatitude) ||
      !Number.isFinite(taskLongitude)
    ) {
      return res
        .status(400)
        .json({ message: "Valid task location is required" });
    }

    const task = await Task.create({
      user: req.user._id,
      parentName: req.body.parentName,
      parentMobile: req.body.parentMobile,
      parentCurrentLocation: req.body.parentCurrentLocation,
      taskLocationType: req.body.taskLocationType,
      taskLocationDescription: req.body.taskLocationDescription,
      taskType: req.body.taskType,
      taskDescription: req.body.taskDescription,
      taskPrice,
      taskLatitude,
      taskLongitude,
    });

    notifyNearbyBuddies(task);

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getAllPendingTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      status: "pending",
      assignedBuddy: null,
    })
      .populate("user", "fullName email mobile")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.acceptTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const buddyId = req.buddy.id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.status !== "pending" || task.assignedBuddy) {
      return res.status(400).json({ message: "Task is no longer available" });
    }

    task.assignedBuddy = buddyId;
    task.status = "accepted";
    await task.save();

    return res.status(200).json({
      message: "Task accepted successfully",
      task,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
