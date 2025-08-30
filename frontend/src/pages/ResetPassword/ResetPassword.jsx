import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaKey, FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/user/reset-password", {
        email,
        otp,
        newPassword
      });

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#2D1B0E]">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-[#3E2723] to-[#4E342E] border border-amber-500 shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-amber-400 mb-6">
          Đặt mật khẩu mới
        </h2>

        {/* Mật khẩu mới */}
        <div className="flex items-center bg-[#2D1B0E] rounded-lg px-3 mb-4 border border-amber-500">
          <FaKey className="text-amber-400 mr-2" />
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-transparent text-white placeholder-amber-200 py-2 focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(prev => !prev)}
            className="text-amber-400 ml-2"
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Xác nhận mật khẩu */}
        <div className="flex items-center bg-[#2D1B0E] rounded-lg px-3 mb-4 border border-amber-500">
          <FaKey className="text-amber-400 mr-2" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-transparent text-white placeholder-amber-200 py-2 focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(prev => !prev)}
            className="text-amber-400 ml-2"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-[#2D1B0E] font-bold 
            rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform"
        >
          Xác nhận <FaArrowRight />
        </button>

        {message && <p className="text-center mt-4 text-sm text-amber-300">{message}</p>}

        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-amber-400 hover:text-amber-600 text-sm font-medium transition-colors"
          >
            Trở về đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
}
