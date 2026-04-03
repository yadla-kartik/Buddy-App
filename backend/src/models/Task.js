const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    // 🔗 LOGIN USER (TASK KA OWNER)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 👈 tera User model
      required: true,
    },

    // 👴 PARENT DETAILS (task ke time jis parent ke liye)
    parentName: {
      type: String,
      required: true,
    },

    parentMobile: {
      type: String,
      required: true,
    },

    parentCurrentLocation: {
      type: String,
      required: true,
    },

    // 📍 LOCATION TYPE
    taskLocationType: {
      type: String,
      enum: ["home", "hospital", "outside", "others"],
      required: true,
    },

    taskLocationDescription: {
      type: String,
      required: false,
    },

    // 🧾 TASK TYPE
    taskType: {
      type: String,
      enum: [
        "need_help",
        "pickup_drop",
        "document_work",
        "hospital_visit",
        "walk",
        "others",
      ],
      required: true,
    },

    // ✍️ TASK DETAILS
    taskDescription: {
      type: String,
      required: true,
    },

    // 🤝 FUTURE: ASSIGNED BUDDY
    assignedBuddy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buddy",
      default: null,
    },

    // 📊 STATUS
    status: {
      type: String,
      enum: ["pending", "accepted", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
