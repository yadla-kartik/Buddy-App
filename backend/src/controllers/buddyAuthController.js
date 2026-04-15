const Buddy = require("../models/Buddy");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getCookieOptions = require("../utils/cookieOptions");
const { ADMIN_ROOM } = require("../socket");

const signBuddyToken = (buddy) =>
  jwt.sign({ id: buddy._id, role: buddy.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const buildBuddyPayload = (buddy) => ({
  id: buddy._id,
  name: buddy.name,
  email: buddy.email,
  mobile: buddy.mobile,
  role: buddy.role,
  isVerified: buddy.isVerified,
  registrationCompleted: buddy.registrationCompleted,
  verificationRequested: buddy.verificationRequested,
  verificationStatus:
    buddy.verificationStatus ||
    (buddy.isVerified
      ? "approved"
      : buddy.verificationRequested
      ? "pending"
      : "not_submitted"),
  verificationRequestedAt: buddy.verificationRequestedAt,
  verificationReviewedAt: buddy.verificationReviewedAt,
  verificationRejectionReason: buddy.verificationRejectionReason,
});

// Signup creates only basic account. No verification request is sent here.
exports.signupBuddy = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, mobile and password are required" });
    }

    const exists = await Buddy.findOne({ $or: [{ email }, { mobile }] });
    if (exists) {
      const message =
        exists.email === email
          ? "Buddy already exists with this email"
          : "Buddy already exists with this mobile number";
      return res.status(400).json({ message });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newBuddy = await Buddy.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      registrationCompleted: false,
      verificationRequested: false,
      isVerified: false,
      verificationStatus: "not_submitted",
    });

    const token = signBuddyToken(newBuddy);
    res.cookie("buddyToken", token, getCookieOptions());

    return res.status(201).json({
      message: "Buddy signup successful",
      buddy: buildBuddyPayload(newBuddy),
    });
  } catch (err) {
    return res.status(500).json({
      message: "Signup failed",
      error: err.message,
    });
  }
};

// Full registration form submit. This marks request for admin verification.
exports.registerBuddy = async (req, res) => {
  try {
    const buddy = await Buddy.findById(req.buddy.id);
    if (!buddy) return res.status(404).json({ message: "Buddy not found" });
    if (buddy.registrationCompleted) {
      return res
        .status(400)
        .json({ message: "Registration form already submitted" });
    }

    const {
      name,
      email,
      mobile,
      city,
      dob,
      permanentAddress,
      panNumber,
      aadhaarNumber,
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      vehicleType,
      vehicleNumber,
      drivingLicenseNumber,
    } = req.body;

    if (
      !name ||
      !email ||
      !mobile ||
      !city ||
      !dob ||
      !permanentAddress ||
      !panNumber ||
      !aadhaarNumber ||
      !bankName ||
      !accountHolderName ||
      !accountNumber ||
      !ifscCode ||
      !vehicleType ||
      !vehicleNumber ||
      !drivingLicenseNumber
    ) {
      return res
        .status(400)
        .json({ message: "All registration fields are required" });
    }

    if (
      !req.files?.panImage?.[0] ||
      !req.files?.aadhaarImage?.[0] ||
      !req.files?.profilePhoto?.[0] ||
      !req.files?.drivingLicenseImage?.[0]
    ) {
      return res
        .status(400)
        .json({ message: "Profile, PAN, Aadhaar and driving license images are required" });
    }

    const duplicate = await Buddy.findOne({
      _id: { $ne: buddy._id },
      $or: [{ email }, { mobile }, { panNumber }, { aadhaarNumber }],
    });

    if (duplicate) {
      return res
        .status(400)
        .json({ message: "Email, mobile, PAN or Aadhaar already in use" });
    }

    buddy.name = name;
    buddy.email = email;
    buddy.mobile = mobile;
    buddy.city = city;
    buddy.dob = new Date(dob);
    buddy.permanentAddress = permanentAddress;
    buddy.panNumber = panNumber;
    buddy.aadhaarNumber = aadhaarNumber;
    buddy.bankName = bankName;
    buddy.accountHolderName = accountHolderName;
    buddy.accountNumber = accountNumber;
    buddy.ifscCode = ifscCode;
    buddy.vehicleType = vehicleType;
    buddy.vehicleNumber = vehicleNumber;
    buddy.drivingLicenseNumber = drivingLicenseNumber;
    buddy.panImage = req.files.panImage[0].path;
    buddy.aadhaarImage = req.files.aadhaarImage[0].path;
    buddy.profilePhoto = req.files.profilePhoto[0].path;
    buddy.drivingLicenseImage = req.files.drivingLicenseImage[0].path;
    buddy.registrationCompleted = true;
    buddy.verificationRequested = true;
    buddy.verificationRequestedAt = new Date();
    buddy.verificationReviewedAt = null;
    buddy.verificationRejectionReason = "";
    buddy.verificationStatus = "pending";
    buddy.isVerified = false;

    await buddy.save();

    const io = req.app.get("io");
    if (io) {
      io.to(ADMIN_ROOM).emit("buddy:registration:submitted", {
        type: "registration_submitted",
        message: `${buddy.name} submitted registration for verification`,
        buddy: buildBuddyPayload(buddy),
      });
    }

    return res.status(200).json({
      message: "Buddy registration submitted for verification",
      buddy: buildBuddyPayload(buddy),
    });
  } catch (err) {
    return res.status(500).json({
      message: "Registration failed",
      error: err.message,
    });
  }
};

exports.loginBuddy = async (req, res) => {
  try {
    const { email, password } = req.body;

    const buddy = await Buddy.findOne({ email });
    if (!buddy) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, buddy.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = signBuddyToken(buddy);
    res.cookie("buddyToken", token, getCookieOptions());

    return res.status(200).json({
      message: "Login successful",
      buddy: buildBuddyPayload(buddy),
    });
  } catch (err) {
    return res.status(500).json({ message: "Login failed", error: err.message });
  }
};

exports.getBuddyStatus = async (req, res) => {
  try {
    const buddy = await Buddy.findById(req.buddy.id).select("-password");

    if (!buddy) {
      return res.status(404).json({ message: "Buddy not found" });
    }

    return res.status(200).json({
      buddy: {
        id: buddy._id,
        name: buddy.name,
        email: buddy.email,
        mobile: buddy.mobile,
        city: buddy.city,
        dob: buddy.dob,
        permanentAddress: buddy.permanentAddress,
        panNumber: buddy.panNumber,
        aadhaarNumber: buddy.aadhaarNumber,
        bankName: buddy.bankName,
        accountHolderName: buddy.accountHolderName,
        accountNumber: buddy.accountNumber,
        ifscCode: buddy.ifscCode,
        vehicleType: buddy.vehicleType,
        vehicleNumber: buddy.vehicleNumber,
        drivingLicenseNumber: buddy.drivingLicenseNumber,
        role: buddy.role,
        isVerified: buddy.isVerified,
        registrationCompleted: buddy.registrationCompleted,
        verificationRequested: buddy.verificationRequested,
        verificationRequestedAt: buddy.verificationRequestedAt,
        verificationStatus:
          buddy.verificationStatus ||
          (buddy.isVerified
            ? "approved"
            : buddy.verificationRequested
            ? "pending"
            : "not_submitted"),
        verificationReviewedAt: buddy.verificationReviewedAt,
        verificationRejectionReason: buddy.verificationRejectionReason,
        panImage: buddy.panImage,
        aadhaarImage: buddy.aadhaarImage,
        profilePhoto: buddy.profilePhoto,
        drivingLicenseImage: buddy.drivingLicenseImage,
        createdAt: buddy.createdAt,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to get status", error: err.message });
  }
};

exports.logoutBuddy = (req, res) => {
  const cookieOptions = getCookieOptions();
  res.clearCookie("buddyToken", {
    httpOnly: cookieOptions.httpOnly,
    sameSite: cookieOptions.sameSite,
    secure: cookieOptions.secure,
  });
  res.status(200).json({ message: "Buddy logged out successfully" });
};
