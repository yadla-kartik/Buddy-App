const crypto = require("crypto");

exports.createPayment = async (req, res) => {
  try {
    // Random amount between 50–300
    const amount = Math.floor(Math.random() * (300 - 50 + 1)) + 50;

    const upiId = "buddy@upi"; // demo UPI ID
    const txnId = crypto.randomBytes(6).toString("hex");

    const upiString = `upi://pay?pa=${upiId}&pn=MyBuddy&am=${amount}&cu=INR&tn=TaskPayment-${txnId}`;

    res.status(200).json({
      amount,
      upiString,
      txnId,
    });
  } catch (err) {
    res.status(500).json({ message: "Payment init failed" });
  }
};
