const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Check for token in cookies (first priority)
  let token = req.cookies.token;

  // If not in cookies, check Authorization header
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.replace("Bearer ", "");
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key-change-in-production"
    );

    // Check if user is a buddy
    if (decoded.role !== "buddy") {
      return res.status(403).json({ message: "Access denied, not a buddy" });
    }

    req.buddy = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};