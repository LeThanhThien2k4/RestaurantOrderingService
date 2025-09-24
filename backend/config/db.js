import mongoose from "mongoose"; // phải import mongoose

import dotenv from "dotenv";
dotenv.config(); // Phải gọi trước khi dùng process.env

export const connectDB = async () => {
  try {
    // Sử dụng biến MONGO_URI từ .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB CONNECTED');
  } catch (error) {
    console.error('DB CONNECTION ERROR:', error);
    process.exit(1); // Thoát process nếu kết nối thất bại
  }
};
