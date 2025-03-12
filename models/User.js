import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Hide password by default
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isAdmin: { type: Boolean, default: false }, // ✅ Ensure isAdmin exists
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
