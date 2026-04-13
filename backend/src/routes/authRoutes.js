const express = require("express");
const { login, register, getMe, changePassword, updateProfile , logout} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", protect, getMe)
router.put("/change-password", protect, changePassword);
router.put("/update-profile", protect, updateProfile);


router.post("/logout", logout);
module.exports = router;
