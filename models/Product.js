import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: false }, // Image URL field
});

export default mongoose.model("Product", ProductSchema);
