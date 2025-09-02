// userModal.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "staff", "admin"], // Các vai trò
      default: "user",                  // Mặc định là user
    },
  },
  { timestamps: true }
);

const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
