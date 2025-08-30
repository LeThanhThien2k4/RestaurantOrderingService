// userRoute.js
import express from 'express';
import { 
  loginUser, 
  registerUser, 
  getAllUsers, 
  forgotPassword, 
  verifyOTP, 
  resetPassword 
} from '../controllers/userController.js';

const userRouter = express.Router();

// REGISTER & LOGIN
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Lấy tất cả user (email + password hashed)
userRouter.get('/all', getAllUsers);

// QUÊN MẬT KHẨU (OTP FLOW)
userRouter.post('/forgot-password', forgotPassword);   // gửi OTP về Gmail
userRouter.post('/verify-otp', verifyOTP);             // xác minh OTP
userRouter.post('/reset-password', resetPassword);     // reset mật khẩu mới

export default userRouter;
