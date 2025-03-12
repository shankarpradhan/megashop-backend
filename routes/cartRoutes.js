import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js"; 
import { addToCart, getCart, removeFromCart, clearCart, cartUpdate } from "../controllers/cartController.js"; 

const router = express.Router();

// 🛒 Cart Routes
router.post("/add", verifyToken, addToCart);
router.get("/", verifyToken, getCart);
router.delete("/remove/:productId", verifyToken, removeFromCart);
router.delete("/clear", verifyToken, clearCart);
router.post("/update", verifyToken, cartUpdate);

export default router;
