const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const buddyAuthRoutes = require("./routes/buddyAuthRoutes");
const taskRoutes = require("./routes/taskRoutes"); 

const adminAuthRoutes = require("./routes/adminAuthRoutes");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

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
