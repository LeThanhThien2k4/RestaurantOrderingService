import React from 'react';

const UserListModal = ({ isOpen, onClose, users }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gradient-to-r from-orange-600 via-red-500 to-red-500 rounded-lg shadow-lg max-w-3xl w-full p-6">
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
                <th className="py-2 px-4 rounded-r-md">Mật khẩu</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b last:border-none hover:bg-purple-50">
                  <td className="py-2 px-4 break-all">{user.email}</td>
                  <td className="py-2 px-4 break-all">{user.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserListModal;
