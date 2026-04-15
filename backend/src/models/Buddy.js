const mongoose = require("mongoose");

const buddySchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  mobile: { type: String, unique: true },
  password: String,
  city: String,
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
  vehicleType: String,
  vehicleNumber: String,
  drivingLicenseNumber: String,
  drivingLicenseImage: String,

  profilePhoto: String,
  isVerified: { type: Boolean, default: false },
  registrationCompleted: { type: Boolean, default: false },
  verificationRequested: { type: Boolean, default: false },
  verificationRequestedAt: Date,
  verificationStatus: {
    type: String,
    enum: ["not_submitted", "pending", "approved", "rejected"],
    default: "not_submitted",
  },
  verificationReviewedAt: Date,
  verificationRejectionReason: String,
  role: { type: String, default: "buddy" }
}, { timestamps: true });

module.exports = mongoose.model("Buddy", buddySchema);
