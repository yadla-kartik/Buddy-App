const express = require("express");
const {
  adminRegister,
  adminLogin,
  getAdminMe,
} = require("../controllers/adminAuthController");

const adminProtect = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.post("/register", adminRegister);
router.post("/login", adminLogin);

// ✅ NEW
router.get("/me", adminProtect, getAdminMe);

module.exports = router;
