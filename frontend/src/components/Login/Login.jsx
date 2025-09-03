// src/components/Login/Login.jsx
import React, { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import { iconClass, inputBase } from "../../assets/dummydata";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";


const url = "http://localhost:4000";

const Login = ({ onLoginSuccess, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("loginData");
    if (stored) setFormData(JSON.parse(stored));
  }, []);

  const handleChange = ({ target: { name, value, type, checked } }) =>
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  // Toast giống Admin
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/user/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (res.status === 200 && res.data.success && res.data.token) {
        localStorage.setItem("authToken", res.data.token);

        if (formData.rememberMe) {
          localStorage.setItem("loginData", JSON.stringify(formData));
        } else {
          localStorage.removeItem("loginData");
        }

        notify("Đăng nhập thành công!", "success");
        setTimeout(() => onLoginSuccess(res.data.token), 1500);
      } else {
        throw new Error(res.data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Đăng nhập thất bại";
      notify(msg, "error");
      triggerShake();
    }
  };

  return (
    <div className="space-y-6 relative">
      <form
        onSubmit={handleSubmit}
        className={`space-y-6 transition-transform ${shake ? "shake" : ""}`}
      >
        <div className="relative">
          <FaUser className={iconClass} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`${inputBase} pl-10 pr-4 py-3`}
            required
          />
        </div>

        <div className="relative">
          <FaLock className={iconClass} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            className={`${inputBase} pl-10 pr-10 py-3`}
            required
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-amber-600 bg-[#2D1B0E] border-amber-400 rounded focus:ring-amber-600"
            />
            <span className="ml-2 text-amber-100">Nhớ mật khẩu</span>
          </label>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-amber-400 hover:text-amber-600 text-sm font-medium transition-colors"
          >
            Quên mật khẩu?
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-[#2D1B0E] font-bold 
          rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform"
        >
          Đăng nhập <FaArrowRight />
        </button>
      </form>

      <div className="text-center">
        <Link
          to="/signup"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-600 transition-colors"
        >
          <FaUserPlus /> Tạo tài khoản
        </Link>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default Login;
