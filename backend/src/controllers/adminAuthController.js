const generateToken = require("../utils/generateToken");
const getCookieOptions = require("../utils/cookieOptions");

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_PAYLOAD = {
  id: "admin-static",
  name: "Admin",
  email: ADMIN_EMAIL,
  role: "admin",
};

// ✅ LOGIN ADMIN
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(ADMIN_PAYLOAD);

    res
      .cookie("adminToken", token, getCookieOptions())
      .status(200)
      .json({
        message: "Admin login successful",
        admin: {
          name: ADMIN_PAYLOAD.name,
          email: ADMIN_PAYLOAD.email,
        },
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAdminMe = async (req, res) => {
  try {
    res.status(200).json({
      name: ADMIN_PAYLOAD.name,
      email: ADMIN_PAYLOAD.email,
      role: ADMIN_PAYLOAD.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load admin" });
  }
};



exports.adminLogout = (req, res) => {
  res.clearCookie("adminToken", { httpOnly: true, sameSite: "lax", secure: false });
  res.status(200).json({ message: "Admin logged out successfully" });
};
