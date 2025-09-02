// admin/src/pages/AccessDenied.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";

const AccessDenied = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Xoá token và role ngay khi load trang
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");

    // Redirect về login sau 3 giây
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-red-950 via-red-900 to-red-800 text-white text-center p-6">
      <div className="bg-red-900/40 p-8 rounded-3xl shadow-2xl border border-red-500/30 max-w-md w-full">
        <FaLock className="text-5xl text-red-400 mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold mb-2">Tài khoản chưa được cấp quyền</h1>
        <p className="text-red-200 mb-4">
          Bạn sẽ được chuyển hướng về trang đăng nhập trong giây lát...
        </p>
        <div className="w-full h-2 bg-red-500/20 rounded-full overflow-hidden">
          <div className="h-2 bg-red-400 animate-[progress_3s_linear_forwards]" />
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
