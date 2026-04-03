const express = require("express");
const router = express.Router();
const { createPayment } = require("../controllers/paymentController");
const protect = require("../middleware/authMiddleware");

router.get("/create", protect, createPayment);

module.exports = router;
