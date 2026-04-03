const Buddy = require("../models/Buddy");

// ✅ GET ALL (name + email)
exports.getAllBuddiesForAdmin = async (req, res) => {
  try {
    const buddies = await Buddy.find()
      .select("name email isVerified createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json(buddies);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch buddies" });
  }
};

// ✅ GET SINGLE
exports.getSingleBuddyForAdmin = async (req, res) => {
  try {
    const buddy = await Buddy.findById(req.params.id).select("-password");
    if (!buddy) {
      return res.status(404).json({ message: "Buddy not found" });
    }
    res.status(200).json(buddy);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch buddy details" });
  }
};

// ✅ VERIFY (NO SOCKET)
exports.verifyBuddy = async (req, res) => {
  try {
    const buddy = await Buddy.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    if (!buddy) {
      return res.status(404).json({ message: "Buddy not found" });
    }

    res.status(200).json({
      message: "Buddy verified",
      buddy,
    });
  } catch (err) {
    res.status(500).json({ message: "Verify failed" });
  }
};
