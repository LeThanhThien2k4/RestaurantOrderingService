import React, { useState } from "react";
import axios from "axios";

const UserListModal = ({ isOpen, onClose, users, refreshUsers }) => {
  const [loading, setLoading] = useState(null); // lưu id user đang update

  if (!isOpen) return null;

  const handleRoleChange = async (userId, newRole) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    await axios.put(
      "http://localhost:4000/api/user/update-role",
      { userId, role: newRole }, // ✅ backend đang nhận userId, role
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Cập nhật quyền thành công!");
    if (refreshUsers) refreshUsers(); // gọi lại để reload danh sách
  } catch (error) {
    console.error("Lỗi cập nhật quyền:", error.response?.data || error);
    alert(error.response?.data?.message || "Không thể cập nhật quyền.");
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gradient-to-r from-orange-600 via-red-500 to-red-500 rounded-lg shadow-lg max-w-4xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-2xl font-semibold">Danh sách Người Dùng</h2>
          <button
            onClick={onClose}
            className="text-white text-3xl font-bold hover:text-gray-300"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="overflow-auto max-h-96 bg-white rounded-md shadow-inner p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-red-400 to-orange-600 text-white">
                <th className="py-2 px-4 rounded-l-md">Email</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4 rounded-r-md">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b last:border-none hover:bg-purple-50"
                  >
                    <td className="py-2 px-4 break-all">{user.email}</td>
                    <td className="py-2 px-4">{user.role}</td>
                    <td className="py-2 px-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        disabled={loading === user._id}
                        className="border rounded px-2 py-1"
                      >
                        <option value="user">User</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    Không có người dùng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserListModal;
