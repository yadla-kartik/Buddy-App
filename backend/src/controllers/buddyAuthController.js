const Buddy = require("../models/Buddy");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerBuddy = async (req, res) => {
  try {
    console.log("📝 BODY =>", req.body);
    console.log("📁 FILES =>", req.files);

    const {
      name,
      email,
      mobile,
      password,
      dob,
      permanentAddress,
      panNumber,
      aadhaarNumber,
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
    } = req.body;

    // 🛑 CHECK ALL FIELDS
    if (
      !name ||
      !email ||
      !mobile ||
      !password ||
      !dob ||
      !permanentAddress ||
      !panNumber ||
      !aadhaarNumber ||
      !bankName ||
      !accountHolderName ||
      !accountNumber ||
      !ifscCode
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🛑 FILES CHECK
    if (!req.files) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    if (!req.files.panImage || req.files.panImage.length === 0) {
      return res.status(400).json({ message: "PAN image is required" });
    }

    if (!req.files.aadhaarImage || req.files.aadhaarImage.length === 0) {
      return res.status(400).json({ message: "Aadhaar image is required" });
    }

    if (!req.files.profilePhoto || req.files.profilePhoto.length === 0) {
      return res.status(400).json({ message: "Profile photo is required" });
    }

    // 🛑 EXIST CHECK
    const exists = await Buddy.findOne({
      $or: [{ email }, { mobile }, { panNumber }, { aadhaarNumber }],
    });

    if (exists) {
      let message = "Buddy already exists with ";
      if (exists.email === email) message += "this email";
      else if (exists.mobile === mobile) message += "this mobile number";
      else if (exists.panNumber === panNumber) message += "this PAN number";
      else if (exists.aadhaarNumber === aadhaarNumber) message += "this Aadhaar number";
      
      return res.status(400).json({ message });
    }

    // 🔐 PASSWORD HASH
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ CREATE BUDDY
    const newBuddy = await Buddy.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      dob: new Date(dob),
      permanentAddress,
      panNumber,
      aadhaarNumber,
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      panImage: req.files.panImage[0].path,
      aadhaarImage: req.files.aadhaarImage[0].path,
      profilePhoto: req.files.profilePhoto[0].path,
    });

    console.log("✅ Buddy Created =>", newBuddy);

    return res.status(201).json({
      message: "Buddy registered successfully",
      buddy: {
        id: newBuddy._id,
        name: newBuddy.name,
        email: newBuddy.email,
      },
    });

  } catch (err) {
    console.error("❌ REGISTER ERROR =>", err);
    return res.status(500).json({ 
      message: "Registration failed", 
      error: err.message 
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

    const token = jwt.sign(
      { id: buddy._id, role: buddy.role },
      process.env.JWT_SECRET || "your-secret-key-change-in-production",
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ RETURN isVerified STATUS
    return res.status(200).json({
      message: "Login successful",
      buddy: {
        id: buddy._id,
        name: buddy.name,
        email: buddy.email,
        role: buddy.role,
        isVerified: buddy.isVerified, // ✅ ADD THIS
      },
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR =>", err);
    return res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// ✅ NEW: CHECK BUDDY STATUS
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
        role: buddy.role,
        isVerified: buddy.isVerified,
        profilePhoto: buddy.profilePhoto,
      },
    });
  } catch (err) {
    console.error("❌ STATUS ERROR =>", err);
    return res.status(500).json({ message: "Failed to get status", error: err.message });
  }
};