const crypto = require("crypto");
const Task = require("../models/Task");

const taskTypeLabel = {
  need_help: "Need Help",
  pickup_drop: "Pickup / Drop",
  document_work: "Document Work",
  hospital_visit: "Hospital Visit",
  walk: "Walk",
  others: "Others",
};

const priceByTaskType = {
  need_help: 200,
  pickup_drop: 250,
  document_work: 300,
  hospital_visit: 400,
  walk: 180,
  others: 220,
};

exports.createPayment = async (req, res) => {
  try {
    const { taskId } = req.query;

    if (!taskId) {
      return res.status(400).json({ message: "taskId is required" });
    }

    const task = await Task.findOne({ _id: taskId, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const amount = priceByTaskType[task.taskType] || task.taskPrice || 220;
    if (task.taskPrice !== amount) {
      task.taskPrice = amount;
      await task.save();
    }

    const upiId = "buddy@upi";
    const txnId = crypto.randomBytes(6).toString("hex");
    const upiString = `upi://pay?pa=${upiId}&pn=MyBuddy&am=${amount}&cu=INR&tn=TaskPayment-${txnId}`;

    return res.status(200).json({
      amount,
      txnId,
      upiString,
      taskSummary: {
        taskId: String(task._id),
        taskType: taskTypeLabel[task.taskType] || task.taskType,
        taskDescription: task.taskDescription,
        parentName: task.parentName,
        parentMobile: task.parentMobile,
        parentCurrentLocation: task.parentCurrentLocation,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Payment init failed" });
  }
};
