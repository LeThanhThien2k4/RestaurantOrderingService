import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/user/login", {
        email,
        password,
      });

      if (res.data?.token) {
        // 🔹 Đổi key thành "authToken" cho đồng bộ
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("role", res.data.role);

        // 🔹 Nếu là admin thì cho vào dashboard
        if (res.data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          setError("Bạn không có quyền admin!");
        }
      } else {
        setError(res.data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi đăng nhập");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d]">
      <div className="bg-[#4b3b3b]/90 backdrop-blur-md rounded-3xl p-8 w-[90%] sm:w-[400px] shadow-2xl border border-amber-500/30">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
          Admin Login
        </h1>
        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#3a2b2b]/70 border border-amber-500/20 text-amber-100 focus:outline-none focus:border-amber-400 placeholder:text-amber-200/50"
            />
          </div>
          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#3a2b2b]/70 border border-amber-500/20 text-amber-100 focus:outline-none focus:border-amber-400 placeholder:text-amber-200/50"
            />
          </div>
          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl text-white font-semibold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-amber-900/30"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
