const User = require("../models/User");
const jwt = require("jsonwebtoken");

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

    // ⚠️ abhi simple password check (hash baad me)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid login" });
    }

    const token = generateToken(user);

    // 🍪 COOKIE SET
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // prod me true
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

//  REGISTER
exports.register = async (req, res) => {
  try {
    const userExists = await User.findOne({
      $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

   const user = await User.create({
  fullName: req.body.fullName,
  email: req.body.email,
  mobile: req.body.mobile,
  password: req.body.password,
  fatherName: req.body.fatherName,
  fatherMobile: req.body.fatherMobile,
  motherName: req.body.motherName,
  motherMobile: req.body.motherMobile,
});

const token = generateToken(user);

    // 🍪 COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // localhost
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    res.status(201).json({
      message: "User registered successfully",
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getMe = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};
