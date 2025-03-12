import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";
const BCRYPT_SALT_ROUNDS = 12;

// ✅ Nodemailer Setup
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ✅ Register User
export const registerUser = async (req, res) => {
    const { name, email, password, role = "user" } = req.body; // Default role is 'user'

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
        const user = await User.create({ name, email, password: hashedPassword, role });

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("Login Attempt:", { email, password });

        // ✅ Explicitly select password in query
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        console.log("User Found:", user);

        // ✅ Ensure password exists
        if (!user.password) {
            console.log("User password is missing in database!");
            return res.status(500).json({ message: "User password is missing" });
        }

        // ✅ Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Invalid credentials: Password mismatch");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        console.log("Password Match:", isMatch);

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        console.log("Generated Token:", token);

        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// ✅ Logout User
export const logoutUser = (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.status(200).json({ message: "Logged out successfully" });
};

// ✅ Forgot Password (Send Reset Email)
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // Token valid for 15 minutes
        await user.save();

        const resetLink = `http://localhost:3000/auth/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Reset Your Password",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        });

        res.json({ message: "Password reset link sent to email" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Reset Password
export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        user.password = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
        user.passwordChangedAt = new Date();
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token" });
    }
};

export const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
  
    if (!token) return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  
    try {
      const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
      req.user = verified; // Attach user payload from token to req
      next();
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid token" });
    }
  };