// admin/src/pages/StaffPanel.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaClipboardList, FaComments } from "react-icons/fa";

const StaffPanel = () => {
  const navigate = useNavigate();

  const goToOrders = () => navigate("/orders");
  const goToChat = () => navigate("/admin/chat");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d] flex justify-center items-center p-6">
      <div className="bg-[#4b3b3b]/90 backdrop-blur-md rounded-3xl shadow-2xl border border-amber-500/30 w-full max-w-4xl p-8">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent mb-8">
          Staff Panel
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Orders Card */}
          <div
            onClick={goToOrders}
            className="cursor-pointer p-6 bg-gradient-to-br from-amber-700 to-amber-800 rounded-2xl shadow-lg hover:scale-[1.03] transition-transform duration-200 text-white flex flex-col items-center justify-center"
          >
            <FaClipboardList className="text-5xl mb-3" />
            <h2 className="text-xl font-semibold">Quản lý đơn hàng</h2>
            <p className="text-sm text-amber-200/80 mt-1">
              Xem và xử lý đơn hàng
            </p>
          </div>

          {/* Chat Card */}
          <div
            onClick={goToChat}
            className="cursor-pointer p-6 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl shadow-lg hover:scale-[1.03] transition-transform duration-200 text-white flex flex-col items-center justify-center"
          >
            <FaComments className="text-5xl mb-3" />
            <h2 className="text-xl font-semibold">Tin nhắn khách hàng</h2>
            <p className="text-sm text-amber-200/80 mt-1">
              Trả lời tin nhắn từ người dùng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPanel;
