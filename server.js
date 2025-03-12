import express from "express";
import dotenv from "dotenv";
// import path from "path";
import connectDB from "./db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan"; // ✅ Logs requests
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js"; // ✅ Custom error handling

dotenv.config();
connectDB();

const app = express();

// ✅ Request Logger (Useful for debugging)
app.use(morgan("dev"));

// ✅ Properly configured CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Uses env variable
    methods: "POST,GET,PUT,DELETE",
    credentials: true, // Allows cookies to be sent
  })
);

app.use(express.json());
app.use(cookieParser());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);

// ✅ Error Handling Middleware
app.use(notFound); // Handles 404
app.use(errorHandler); // Handles all errors

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
