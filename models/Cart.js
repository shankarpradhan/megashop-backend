import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",  // Reference to User model
    required: true 
  },
  products: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
    }
  ],
}, { timestamps: true });

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
