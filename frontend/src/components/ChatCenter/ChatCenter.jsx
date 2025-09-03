import React, { useState } from 'react';
import ChatBox from '../ChatBox/ChatBox';
import ChatBot from '../ChatBot/ChatBot';
import axios from 'axios';

const ChatCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('admin'); // admin | bot
  const [refreshKey, setRefreshKey] = useState(0); // 🔥 Key để ép ChatBox reload dữ liệu

  // Hàm xóa tất cả tin nhắn
  const handleDeleteAll = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá tất cả tin nhắn?')) return;
    try {
      await axios.delete('http://localhost:4000/api/messages');
      alert('Đã xoá tất cả tin nhắn');
      setRefreshKey((prev) => prev + 1); // 🔥 Tăng key => ChatBox refresh UI
    } catch (err) {
      console.error('Lỗi xoá tin nhắn:', err);
      alert('Xoá tin nhắn thất bại!');
    }
  };

  return (
    <div>
      {/* Nút mở chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-full shadow-lg z-50 transition"
        >
          💬 Chat
        </button>
      )}

      {/* Khung chat */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 w-96 max-w-full bg-[#3a1f0c] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center bg-orange-700 px-4 py-2">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                  activeTab === 'admin'
                    ? 'bg-orange-500 text-white'
                    : 'bg-orange-200 text-orange-800'
                }`}
              >
                👨‍💼 Staff
              </button>
              <button
                onClick={() => setActiveTab('bot')}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                  activeTab === 'bot'
                    ? 'bg-orange-500 text-white'
                    : 'bg-orange-200 text-orange-800'
                }`}
              >
                🤖 Chatbot
              </button>
            </div>

            <div className="flex gap-2 items-center">
              {/* Nút xoá tin nhắn chỉ hiện khi tab admin */}
              {activeTab === 'admin' && (
                <button
                  onClick={handleDeleteAll}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Xoá tất cả
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="bg-orange-500 hover:bg-orange-700 text-white px-3 py-1 rounded-lg"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 bg-[#2f1606]">
            {activeTab === 'admin' ? (
              <ChatBox embedMode key={refreshKey} />
            ) : (
              <ChatBot embedMode />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatCenter;
