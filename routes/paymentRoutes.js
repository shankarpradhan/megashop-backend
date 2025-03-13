import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";

import { verifyToken } from "../controllers/authController.js";

dotenv.config();
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🏷️ Create an Order (Protected Route)
router.post("/order", verifyToken, async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // ✅ Validate input
    if (!amount || !currency || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount and currency are required" });
    }

    const options = {
      amount: amount * 100, // ✅ Convert to paise
      currency,
      receipt: `order_rcptid_${Date.now()}`, // Use timestamp for unique receipt ID
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ success: false, message: "Error creating order", error });
  }
});


router.post("/verify", verifyToken, async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
      // ✅ Ensure all required fields are present
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: "Missing payment details" });
      }
  
      // ✅ Generate signature for verification
      const secret = process.env.RAZORPAY_KEY_SECRET;
      const generatedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
  
      // ✅ Compare generated signature with received signature
      if (generatedSignature === razorpay_signature) {
        // 🏆 Payment is verified!
        res.json({ success: true, message: "Payment verified successfully" });
      } else {
        res.status(400).json({ success: false, message: "Payment verification failed" });
      }
    } catch (error) {
      console.error("Payment Verification Error:", error);
      res.status(500).json({ success: false, message: "Error verifying payment", error: error.message });
    }
  });
  

export default router;
