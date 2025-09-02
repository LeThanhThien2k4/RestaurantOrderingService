import userModel from "../modals/userModal.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import nodemailer from "nodemailer";

// ================== CONFIG EMAIL ==================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "2200007423@nttu.edu.vn", // Gmail của bạn
    pass: "vszc igtv didv nova",    // App Password
  },
});

// Lưu OTP tạm: { email: { code, expires } }
let otpStore = {};

// Tạo JWT token
const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "2h" });
};

// ================== LOGIN ==================
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id, user.role);
    res.json({
      success: true,
      token,
      role: user.role,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Login failed. Please try again." });
  }
};

// ================== REGISTER ==================
const registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: "Email đã được sử dụng." });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Email không hợp lệ." });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Mật khẩu phải ít nhất 8 ký tự." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id, user.role);

    res.status(201).json({ success: true, token, role: user.role });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Đăng ký thất bại. Vui lòng thử lại." });
  }
};

// ================== GET ALL USERS ==================
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, "username email role createdAt");
    res.status(200).json({
      success: true,
      users, // ✅ luôn gói trong "users"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách người dùng.",
    });
  }
};


// ================== UPDATE USER ROLE (Admin Only) ==================
const updateUserRole = async (req, res) => {
  const { userId, role } = req.body;

  if (!['user', 'staff', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: "Role không hợp lệ." });
  }

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true, select: "username email role createdAt" }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User không tồn tại." });
    }
    res.json({ success: true, message: "Cập nhật quyền thành công.", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server khi cập nhật quyền." });
  }
};

// ================== FORGOT PASSWORD FLOW ==================

// 1. Gửi OTP qua email
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email không tồn tại." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = {
      code: otp,
      expires: Date.now() + 5 * 60 * 1000,
    };

    await transporter.sendMail({
      from: '"FOODIEFRENZY" <2200007423@nttu.edu.vn>',
      to: email,
      subject: "Mã OTP khôi phục mật khẩu",
      text: `Mã OTP của bạn là: ${otp}. OTP có hiệu lực trong 5 phút.`,
    });

    res.json({ success: true, message: "OTP đã được gửi về email của bạn." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server khi gửi OTP." });
  }
};

// 2. Xác thực OTP
const verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (record && record.code === otp && Date.now() < record.expires) {
    return res.json({ success: true, message: "Xác thực OTP thành công." });
  }

  return res.status(400).json({ success: false, message: "OTP không hợp lệ hoặc đã hết hạn." });
};

// 3. Reset mật khẩu
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const record = otpStore[email];
    if (!(record && record.code === otp && Date.now() < record.expires)) {
      return res.status(400).json({ success: false, message: "OTP không hợp lệ hoặc đã hết hạn." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await userModel.findOneAndUpdate({ email }, { password: hashedPassword });
    delete otpStore[email];

    res.json({ success: true, message: "Mật khẩu đã được đặt lại thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server khi đặt lại mật khẩu." });
  }
};

export {
  loginUser,
  registerUser,
  getAllUsers,
  updateUserRole,
  forgotPassword,
  verifyOTP,
  resetPassword,
};
