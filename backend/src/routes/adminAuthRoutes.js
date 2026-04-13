const express = require("express");
const {
  adminRegister,
  adminLogin,
  getAdminMe,
  adminLogout,
} = require("../controllers/adminAuthController");

const adminProtect = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.post("/register", adminRegister);
router.post("/login", adminLogin);

// Protected routes
router.get("/me", adminProtect, getAdminMe);
router.post("/logout", adminLogout);

module.exports = router;
