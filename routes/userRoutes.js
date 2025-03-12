import express from "express";
import {
    getAllUsers,
    getUserById,
    updateUserProfile,
    updateUserProfileAdmin,
    deleteUser,
    loginUser, // ✅ Add this
    registerUser, // ✅ Add this
    forgotPassword,
    resetPassword
} from "../controllers/userController.js";
import { authenticateUser,verifyAdmin, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Register User (Public Route)
router.post("/register", registerUser);

// ✅ Login User (Public Route)
router.post("/login", loginUser); // ✅ Add this

// ✅ Get All Users (Admin Only)
router.get("/", authenticateUser, authorizeRoles("admin"), getAllUsers);

// ✅ Get User by ID (Admin Only)
router.get("/:id", authenticateUser, authorizeRoles("admin"), getUserById);

// ✅ Update User Profile (Logged-in User)
router.put("/profile", authenticateUser, updateUserProfile);

// ✅ Delete User (Admin Only)
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteUser);
router.put("/:id", authenticateUser, verifyAdmin, updateUserProfileAdmin);
router.post("/forgot-password", forgotPassword);

// ✅ Reset Password
router.post("/reset-password", resetPassword);

export default router;
