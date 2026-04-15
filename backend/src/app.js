const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const buddyAuthRoutes = require("./routes/buddyAuthRoutes");
const taskRoutes = require("./routes/taskRoutes"); 

const adminAuthRoutes = require("./routes/adminAuthRoutes");

const app = express();
const MAX_FILE_SIZE_MB = 5;

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("allowedOrigins", allowedOrigins);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/buddy", buddyAuthRoutes);
app.use("/api/tasks", taskRoutes);


app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", require("./routes/adminBuddyRoutes"));

app.use("/api/payment", require("./routes/paymentRoutes"));

app.use((err, req, res, next) => {
  if (err && err.name === "MulterError" && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      message: `File size is too large. Please upload within ${MAX_FILE_SIZE_MB} MB.`,
      field: err.field || null,
      maxSizeMB: MAX_FILE_SIZE_MB,
    });
  }

  if (err && err.message === "Only image files are allowed!") {
    return res.status(400).json({
      message: err.message,
      field: err.field || null,
    });
  }

  if (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }

  return next();
});



module.exports = app;
