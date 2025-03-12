import Cart from "../models/Cart.js";
import mongoose from "mongoose";


// 🛒 Add Product to Cart
// Example: Server-side cartController.js

export const addToCart = async (req, res) => {
    try {
        const { productId, name, price, image, quantity } = req.body;
        const userId = req.user.id; // Get userId from decoded token

        // Validate required fields
        if (!productId || !name || !price || !image || !quantity) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Find the user's cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // If the user doesn't have a cart, create a new one
            cart = new Cart({
                userId,
                products: [{
                    productId,
                    name,
                    price,
                    image,
                    quantity
                }]
            });
        } else {
            // Check if the product is already in the cart
            const existingProductIndex = cart.products.findIndex(p => p.productId === productId);

            if (existingProductIndex > -1) {
                // If product exists, update the quantity
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                // Otherwise, add the new product to the cart
                cart.products.push({
                    productId,
                    name,
                    price,
                    image,
                    quantity
                });
            }
        }

        // Save the cart
        await cart.save();

        res.status(200).json({ message: "Product added to cart", cart });

    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


  
  

// 📌 Get Cart Items
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart) {
      return res.json({ success: true, cart: { userId, products: [] } });
    }

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching cart", error });
  }
};

 // Ensure correct path

export const removeFromCart = async (req, res) => {
  try {
      const { productId } = req.params; // Extract productId from URL
      const userId = req.user.id; // Get user ID from auth middleware
    
      // Find the cart first
      let cart = await Cart.findOne({ userId });
    
      if (!cart) {
          return res.status(404).json({ success: false, message: "Cart not found" });
      }
    
      // Remove product from cart's products array manually
      cart.products = cart.products.filter(item => item.productId !== productId);
    
      // ✅ Save changes explicitly
      await cart.save();
    
      res.json({ success: true, message: "Product removed", cart });
  } catch (error) {
      console.error("Error removing item:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};


// 🗑️ Clear Cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.findOneAndDelete({ userId });

    res.json({ success: true, message: "Cart cleared!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error clearing cart", error });
  }
};

export const cartUpdate = async (req, res) => {
    const userId = req.user.id; // Assuming user authentication
    const { cart } = req.body;
    try {
        // Update user's cart in the database
        const updatedCart = await Cart.updateOne({ userId }, { $set: { items: cart } });
        res.status(200).json({ message: "Cart updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating cart" });
    }
};
