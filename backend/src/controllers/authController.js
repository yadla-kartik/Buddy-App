const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const getCookieOptions = require("../utils/cookieOptions");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.fullName,
      email: user.email,
      mobile: user.mobile,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid login" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    res.cookie("userToken", token, getCookieOptions());

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const userExists = await User.findOne({
      $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      mobile: req.body.mobile,
      city: req.body.city,
      emergencyContact: req.body.emergencyContact,
      alternateContact: req.body.alternateContact,
      password: hashedPassword,
    });

    const token = generateToken(user);
    res.cookie("userToken", token, getCookieOptions());

    return res.status(201).json({
      message: "User registered successfully",
      role: user.role,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const token = req.cookies.userToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      city,
      state,
      address,
      emergencyContact,
      alternateContact,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (city) user.city = city;
    if (state) user.state = state;
    if (address) user.address = address;
    if (emergencyContact) user.emergencyContact = emergencyContact;
    if (alternateContact !== undefined) {
      user.alternateContact = alternateContact;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.logout = (req, res) => {
  const cookieOptions = getCookieOptions();

  res.clearCookie("userToken", {
    httpOnly: cookieOptions.httpOnly,
    sameSite: cookieOptions.sameSite,
    secure: cookieOptions.secure,
  });

  return res.status(200).json({ message: "Logged out successfully" });
};
