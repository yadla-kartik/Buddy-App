const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    fatherName: {
      type: String,
      required: true,
    },

    fatherMobile: {
      type: String,
      required: false,   // optional
    },

    motherName: {
      type: String,
      required: true,
    },

    motherMobile: {
      type: String,
      required: false,   // optional
    },

    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
