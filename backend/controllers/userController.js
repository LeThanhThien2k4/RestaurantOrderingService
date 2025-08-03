import userModel from "../modals/userModal.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Tạo JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "2h" });
};

// LOGIN FUNCTION
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

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Login failed. Please try again." });
  }
};

// REGISTER FUNCTION
const registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Kiểm tra trùng email
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: "Email đã được sử dụng." });
    }

    // VALIDATION
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Email không hợp lệ." });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Mật khẩu phải ít nhất 8 ký tự." });
    }

    // Tạo hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Đăng ký thất bại. Vui lòng thử lại." });
  }
};

export { loginUser, registerUser };
