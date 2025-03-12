import express from "express";
import { payment,verifyPayment } from "../controllers/paymentController.js";
// import { authenticateUser, authorizeRoles, verifyToken } from "../middlewares/authMiddleware.js";



const router = express.Router();



// ✅ Create Order Route
router.post("/order", payment);

// ✅ Verify Payment Route
router.post("/verify", verifyPayment);

export default router;
