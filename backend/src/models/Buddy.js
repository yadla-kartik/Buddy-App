const mongoose = require("mongoose");

const buddySchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  mobile: { type: String, unique: true },
  password: String,
  dob: Date,
  permanentAddress: String,
  panNumber: { type: String, unique: true },
  panImage: String,
  aadhaarNumber: { type: String, unique: true },
  aadhaarImage: String,

  bankName: String,
  accountHolderName: String,
  accountNumber: String,
  ifscCode: String,

  profilePhoto: String,
  isVerified: { type: Boolean, default: false },
  role: { type: String, default: "buddy" }
}, { timestamps: true });

module.exports = mongoose.model("Buddy", buddySchema);
