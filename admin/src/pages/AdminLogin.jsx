// admin/src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/animations.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const notify = (msg, type = "error") => {
    toast(msg, {
      type,
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      style: {
        background: "#3a2b2b",
        color: "#fff",
        border: "1px solid #d97706",
        borderRadius: "10px",
        fontSize: "14px",
      },
      progressStyle: { background: "#f59e0b" },
    });
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/user/login", {
        email,
        password,
      });

      if (res.data?.token) {
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("role", res.data.role);

        if (res.data.role === "admin") {
          notify("Đăng nhập thành công (Admin)!", "success");
          setTimeout(() => navigate("/admin/dashboard"), 1500);
        } else if (res.data.role === "staff") {
          notify("Đăng nhập thành công (Nhân viên)!", "success");
          setTimeout(() => navigate("/admin/staff"), 1500);
        } else {
          notify("Tài khoản chưa được cấp quyền!");
          setTimeout(() => navigate("/access-denied"), 1500);
        }
      } else {
        notify("Đăng nhập thất bại, vui lòng kiểm tra lại!");
        triggerShake();
      }
    } catch (err) {
      notify("Email hoặc mật khẩu không đúng!");
      triggerShake();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d]">
      <div
        className={`bg-[#4b3b3b]/90 backdrop-blur-md rounded-3xl p-8 w-[90%] sm:w-[400px] shadow-2xl border border-amber-500/30 transition-transform ${
          shake ? "shake" : ""
        }`}
      >
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
          Login Admin
        </h1>
        <form onSubmit={handleLogin} className="space-y-5">
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
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl text-white font-semibold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-amber-900/30"
          >
            Đăng nhập
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminLogin;
