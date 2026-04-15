const Buddy = require("../models/Buddy");
const { ADMIN_ROOM, getBuddyRoom } = require("../socket");

const buildBuddyPayload = (buddy) => ({
  id: buddy._id,
  name: buddy.name,
  email: buddy.email,
  mobile: buddy.mobile,
  role: buddy.role,
  isVerified: buddy.isVerified,
  registrationCompleted: buddy.registrationCompleted,
  verificationRequested: buddy.verificationRequested,
  verificationStatus:
    buddy.verificationStatus ||
    (buddy.isVerified
      ? "approved"
      : buddy.verificationRequested
      ? "pending"
      : "not_submitted"),
  verificationRequestedAt: buddy.verificationRequestedAt,
  verificationReviewedAt: buddy.verificationReviewedAt,
  verificationRejectionReason: buddy.verificationRejectionReason,
  createdAt: buddy.createdAt,
  updatedAt: buddy.updatedAt,
});

const emitVerificationUpdate = (req, buddy, message) => {
  const io = req.app.get("io");
  if (!io) return;

  const payload = {
    type: "verification_updated",
    message,
    buddy: buildBuddyPayload(buddy),
  };

  io.to(ADMIN_ROOM).emit("buddy:verification:updated", payload);
  io.to(getBuddyRoom(String(buddy._id))).emit("buddy:verification:updated", payload);
};

exports.getAllBuddiesForAdmin = async (req, res) => {
  try {
    const buddies = await Buddy.find({
      $or: [
        { verificationStatus: { $in: ["pending", "approved", "rejected"] } },
        { verificationRequested: true },
        { isVerified: true },
      ],
    })
      .select(
        "name email isVerified createdAt updatedAt verificationStatus verificationRequested verificationRequestedAt verificationReviewedAt verificationRejectionReason"
      )
      .sort({ updatedAt: -1 });

    res.status(200).json(buddies);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch buddies" });
  }
};

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

exports.verifyBuddy = async (req, res) => {
  try {
    const buddy = await Buddy.findById(req.params.id);

    if (!buddy) {
      return res.status(404).json({ message: "Buddy not found" });
    }

    buddy.isVerified = true;
    buddy.registrationCompleted = true;
    buddy.verificationRequested = false;
    buddy.verificationStatus = "approved";
    buddy.verificationRejectionReason = "";
    buddy.verificationReviewedAt = new Date();
    await buddy.save();

    const message = `${buddy.name} has been approved`;
    emitVerificationUpdate(req, buddy, message);

    res.status(200).json({
      message: "Buddy verified",
      buddy: buildBuddyPayload(buddy),
    });
  } catch (err) {
    res.status(500).json({ message: "Verify failed" });
  }
};

exports.rejectBuddy = async (req, res) => {
  try {
    const buddy = await Buddy.findById(req.params.id);
    if (!buddy) {
      return res.status(404).json({ message: "Buddy not found" });
    }

    const reason = String(req.body?.reason || "").trim();

    buddy.isVerified = false;
    buddy.registrationCompleted = false;
    buddy.verificationRequested = false;
    buddy.verificationStatus = "rejected";
    buddy.verificationRejectionReason = reason || "Rejected by admin";
    buddy.verificationReviewedAt = new Date();
    await buddy.save();

    const message = `${buddy.name} has been rejected`;
    emitVerificationUpdate(req, buddy, message);

    res.status(200).json({
      message: "Buddy rejected",
      buddy: buildBuddyPayload(buddy),
    });
  } catch (err) {
    res.status(500).json({ message: "Reject failed" });
  }
};
