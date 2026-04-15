const jwt = require("jsonwebtoken");
const ADMIN_EMAIL = "admin@gmail.com";

const adminProtect = async (req, res, next) => {
  try {
    const token = req.cookies?.adminToken; // ✅ FIX

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded?.email !== ADMIN_EMAIL || decoded?.role !== "admin") {
      return res.status(401).json({ message: "Admin not authorized" });
    }

    req.admin = {
      id: decoded.id || "admin-static",
      name: decoded.name || "Admin",
      email: ADMIN_EMAIL,
      role: "admin",
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

module.exports = adminProtect;
