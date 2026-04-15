const Task = require("../models/Task");
const Buddy = require("../models/Buddy");
const { getBuddyRoom, getCityBuddyRoom, getUserRoom } = require("../socket");

const priceByTaskType = {
  need_help: 200,
  pickup_drop: 250,
  document_work: 300,
  hospital_visit: 400,
  walk: 180,
  others: 220,
};

const normalizeCity = (city) => String(city || "").trim().toLowerCase();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildTaskResponse = (taskDoc) => {
  const task = taskDoc?.toObject ? taskDoc.toObject() : taskDoc;
  if (!task) return null;

  return {
    ...task,
    taskCity: task.taskCity,
    userName: task.user?.fullName || null,
    userEmail: task.user?.email || null,
    userMobile: task.user?.mobile || null,
    buddyName: task.assignedBuddy?.name || null,
    buddyEmail: task.assignedBuddy?.email || null,
    buddyMobile: task.assignedBuddy?.mobile || null,
  };
};

const buildCityMatchQuery = (city) => {
  const normalizedCity = normalizeCity(city);
  if (!normalizedCity) return null;

  const exactCityRegex = new RegExp(`^${escapeRegex(normalizedCity)}$`, "i");
  const containsCityRegex = new RegExp(escapeRegex(normalizedCity), "i");

  return {
    $or: [{ taskCity: exactCityRegex }, { parentCurrentLocation: containsCityRegex }],
  };
};

exports.createTask = async (req, res) => {
  try {
    const taskLatitude = Number(req.body.taskLatitude);
    const taskLongitude = Number(req.body.taskLongitude);
    const taskType = req.body.taskType;
    const taskPrice = priceByTaskType[taskType] || 220;
    const taskCity = normalizeCity(req.body.taskCity || req.user?.city);

    if (!Number.isFinite(taskLatitude) || !Number.isFinite(taskLongitude)) {
      return res.status(400).json({ message: "Valid task location is required" });
    }

    if (!taskCity) {
      return res.status(400).json({ message: "Task city is required" });
    }

    const task = await Task.create({
      user: req.user._id,
      parentName: req.body.parentName,
      parentMobile: req.body.parentMobile,
      parentCurrentLocation: req.body.parentCurrentLocation,
      taskCity,
      taskLocationType: req.body.taskLocationType,
      taskLocationDescription: req.body.taskLocationDescription,
      taskType,
      taskDescription: req.body.taskDescription,
      taskPrice,
      taskLatitude,
      taskLongitude,
      rejectedBuddies: [],
    });

    const populatedTask = await Task.findById(task._id)
      .populate("user", "fullName email mobile city")
      .populate("assignedBuddy", "name email mobile city");

    const io = req.app.get("io");
    if (io) {
      io.to(getCityBuddyRoom(taskCity)).emit("task:new_for_city", {
        type: "task_created",
        message: `New task available in ${taskCity}`,
        task: buildTaskResponse(populatedTask),
      });
    }

    return res.status(201).json({
      message: "Task created successfully",
      task: buildTaskResponse(populatedTask),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getAllPendingTasks = async (req, res) => {
  try {
    const buddyId = String(req.buddy.id);
    const buddy = await Buddy.findById(buddyId).select("city");
    const buddyCity = normalizeCity(buddy?.city);

    if (!buddyCity) {
      return res.status(200).json({
        message: "Buddy city not available. Please complete profile.",
        tasks: [],
      });
    }

    const cityMatch = buildCityMatchQuery(buddyCity);

    const tasks = await Task.find({
      status: "pending",
      assignedBuddy: null,
      rejectedBuddies: { $ne: buddyId },
      ...(cityMatch || {}),
    })
      .populate("user", "fullName email mobile city")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Tasks fetched successfully",
      tasks: tasks.map(buildTaskResponse),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getBuddyTasks = async (req, res) => {
  try {
    const buddyId = String(req.buddy.id);

    const tasks = await Task.find({ assignedBuddy: buddyId })
      .populate("user", "fullName email mobile city")
      .populate("assignedBuddy", "name email mobile city")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      message: "Buddy tasks fetched successfully",
      tasks: tasks.map(buildTaskResponse),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.acceptTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const buddyId = String(req.buddy.id);

    const [task, buddy] = await Promise.all([
      Task.findById(taskId)
        .populate("user", "fullName email mobile city")
        .populate("assignedBuddy", "name email mobile city"),
      Buddy.findById(buddyId).select("name city"),
    ]);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!buddy) {
      return res.status(404).json({ message: "Buddy not found" });
    }

    if (task.status !== "pending" || task.assignedBuddy) {
      return res.status(400).json({ message: "Task is no longer available" });
    }

    if (task.rejectedBuddies.some((id) => String(id) === buddyId)) {
      return res.status(400).json({ message: "You already rejected this task" });
    }

    const buddyCity = normalizeCity(buddy.city);
    const cityMatch = buildCityMatchQuery(buddyCity);
    const matchesCity = cityMatch
      ? (cityMatch.$or || []).some((rule) => {
          const key = Object.keys(rule)[0];
          return rule[key].test(String(task[key] || ""));
        })
      : false;

    if (!matchesCity) {
      return res.status(400).json({ message: "Task does not belong to your city" });
    }

    task.assignedBuddy = buddyId;
    task.status = "accepted";
    await task.save();

    const updatedTask = await Task.findById(taskId)
      .populate("user", "fullName email mobile city")
      .populate("assignedBuddy", "name email mobile city");

    const responseTask = buildTaskResponse(updatedTask);
    const io = req.app.get("io");

    if (io) {
      io.to(getCityBuddyRoom(normalizeCity(updatedTask.taskCity))).emit("task:updated_for_city", {
        type: "task_accepted",
        taskId: String(updatedTask._id),
        status: updatedTask.status,
        assignedBuddyId: buddyId,
      });

      io.to(getUserRoom(String(updatedTask.user?._id))).emit("task:user_update", {
        type: "task_accepted",
        message: `${buddy.name} accepted your task`,
        task: responseTask,
      });

      io.to(getBuddyRoom(buddyId)).emit("task:assigned_to_buddy", {
        type: "task_assigned",
        message: `You accepted task for ${updatedTask.parentName}`,
        task: responseTask,
      });
    }

    return res.status(200).json({
      message: "Task accepted successfully",
      task: responseTask,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.rejectTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const buddyId = String(req.buddy.id);

    const task = await Task.findById(taskId).populate("user", "fullName email mobile city");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.status !== "pending" || task.assignedBuddy) {
      return res.status(400).json({ message: "Task is no longer available" });
    }

    if (task.rejectedBuddies.some((id) => String(id) === buddyId)) {
      return res.status(200).json({
        message: "Task already rejected",
        task: buildTaskResponse(task),
      });
    }

    task.rejectedBuddies.push(buddyId);
    await task.save();

    const io = req.app.get("io");
    if (io) {
      io.to(getBuddyRoom(buddyId)).emit("task:rejected_by_buddy", {
        type: "task_rejected",
        message: "Task removed from your list",
        taskId: String(task._id),
      });
    }

    return res.status(200).json({
      message: "Task rejected successfully",
      task: buildTaskResponse(task),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const buddyId = String(req.buddy.id);

    const task = await Task.findById(taskId)
      .populate("user", "fullName email mobile city")
      .populate("assignedBuddy", "name email mobile city");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (String(task.assignedBuddy?._id || "") !== buddyId) {
      return res.status(403).json({ message: "You are not assigned to this task" });
    }

    if (!["accepted", "in_progress"].includes(task.status)) {
      return res.status(400).json({ message: "Only active tasks can be completed" });
    }

    task.status = "completed";
    await task.save();

    const updatedTask = await Task.findById(taskId)
      .populate("user", "fullName email mobile city")
      .populate("assignedBuddy", "name email mobile city");

    const responseTask = buildTaskResponse(updatedTask);
    const io = req.app.get("io");

    if (io) {
      io.to(getUserRoom(String(updatedTask.user?._id))).emit("task:user_update", {
        type: "task_completed",
        message: `${updatedTask.assignedBuddy?.name || "Buddy"} completed your task`,
        task: responseTask,
      });

      io.to(getBuddyRoom(buddyId)).emit("task:completed_by_buddy", {
        type: "task_completed",
        message: "Task marked as completed",
        task: responseTask,
      });
    }

    return res.status(200).json({
      message: "Task completed successfully",
      task: responseTask,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
      .populate("user", "fullName email mobile city")
      .populate("assignedBuddy", "name email mobile city")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      message: "User tasks fetched successfully",
      tasks: tasks.map(buildTaskResponse),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
