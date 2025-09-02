import express from 'express';
import {
  loginUser,
  registerUser,
  getAllUsers,
  updateUserRole,
  forgotPassword,
  verifyOTP,
  resetPassword
} from '../controllers/userController.js';
import authMiddleware, { isAdmin } from '../middleware/auth.js'; // Đổi sang file chuẩn

const userRouter = express.Router();

// ================== AUTH ==================
userRouter.post('/register', registerUser);  // Đăng ký
userRouter.post('/login', loginUser);        // Đăng nhập

// ================== USER MANAGEMENT ==================
// Lấy danh sách user: chỉ admin mới xem được
userRouter.get('/all', authMiddleware, isAdmin, getAllUsers);

// Cập nhật quyền (role) user: chỉ admin mới chỉnh được
userRouter.put('/role', authMiddleware, isAdmin, updateUserRole);

// ================== FORGOT PASSWORD FLOW ==================
userRouter.post('/forgot-password', forgotPassword); // Gửi OTP qua email
userRouter.post('/verify-otp', verifyOTP);           // Xác minh OTP
userRouter.post('/reset-password', resetPassword);   // Đặt lại mật khẩu

export default userRouter;
