import express from "express";
import Product from "../models/Product.js";
import { authenticateUser, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Get all products (Public - No authentication needed)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// ✅ Add new product (Only Admins)
router.post("/", authenticateUser, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, price, image } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = new Product({ name, price, image });
    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);  // Log the error to see more details
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
});

// ✅ Update product (Only Admins)
router.put("/:id", authenticateUser, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, price, image } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, image },
      { new: true }
    );
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
});

// ✅ Delete product (Only Admins)
router.delete("/:id", authenticateUser, authorizeRoles("admin"), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

export default router;
