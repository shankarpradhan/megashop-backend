// import jwt from "jsonwebtoken";

// export const authenticateUser = (req, res, next) => {
//     const token = req.cookies.token;
//     if (!token) return res.status(401).json({ message: "Unauthorized" });

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) return res.status(401).json({ message: "Invalid token" });

//         req.user = decoded;
//         next();
//     });
// };
import express from "express";
import { 
    loginUser, 
    registerUser, 
    logoutUser, 
    forgotPassword, 
    resetPassword 
} from "../controllers/authController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Delete User
router.delete("/users/:id", verifyToken, verifyAdmin, deleteUser);

// ✅ Edit User
router.put("/users/:id", verifyToken, verifyAdmin, updateUserProfile);


// ✅ Register User
router.post("/register", registerUser);

// ✅ Login User
router.post("/login", loginUser);

// ✅ Logout User
router.post("/logout", logoutUser);

// ✅ Forgot Password (Send Reset Email)
router.post("/forgot-password", forgotPassword);

// ✅ Reset Password
router.post("/reset-password", resetPassword);

export default router;  
