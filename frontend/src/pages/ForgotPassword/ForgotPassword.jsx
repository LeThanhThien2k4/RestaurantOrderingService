import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaArrowRight } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/user/forgot-password", { email });
      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
      }, 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#2D1B0E]">
      <div className="bg-gradient-to-b from-[#3E2F2A] to-[#2D1B0E] p-8 rounded-xl shadow-lg w-96 border border-amber-600/30">
        <h2 className="text-2xl font-bold text-center text-amber-400 mb-6">
          Quên mật khẩu
        </h2>

        <form onSubmit={handleForgotPassword} className="space-y-5">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#3E2F2A] text-white placeholder:text-amber-200 
                border border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-[#2D1B0E] font-bold 
              rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform"
          >
            Gửi OTP <FaArrowRight />
          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm text-amber-200">{message}</p>}

        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-amber-400 hover:text-amber-600 text-sm font-medium transition-colors"
          >
            Trở về đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
