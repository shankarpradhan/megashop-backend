import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js"; // Adjust based on your project

dotenv.config(); // ✅ Load .env file

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const email = "techlearn924@gmail.com";
        const newPassword = "shan123";

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.updateOne({ email }, { password: hashedPassword });

        console.log("✅ Password reset successfully!");
        mongoose.disconnect();
    } catch (error) {
        console.error("❌ Error resetting password:", error);
    }
};

resetPassword();
