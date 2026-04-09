const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const getCookieOptions = require("../utils/cookieOptions");

// ✅ REGISTER ADMIN
exports.adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });

    res
      .cookie("adminToken", token, getCookieOptions())
      .status(201)
      .json({
        message: "Admin registered successfully",
        admin: {
          name: admin.name,
          email: admin.email,
        },
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ LOGIN ADMIN
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });

    res
      .cookie("adminToken", token, getCookieOptions())
      .status(200)
      .json({
        message: "Admin login successful",
        admin: {
          name: admin.name,
          email: admin.email,
        },
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAdminMe = async (req, res) => {
  try {
    const admin = req.admin; // from protect middleware

    res.status(200).json({
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load admin" });
  }
};
