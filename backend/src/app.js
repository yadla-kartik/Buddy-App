const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const buddyAuthRoutes = require("./routes/buddyAuthRoutes");
const taskRoutes = require("./routes/taskRoutes"); 

const adminAuthRoutes = require("./routes/adminAuthRoutes");

const app = express();

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

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



module.exports = app;
