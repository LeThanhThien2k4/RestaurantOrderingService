import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get('http://localhost:4000/api/messages');
        setMessages(data);
      } catch (err) {
        setError('Lỗi khi tải tin nhắn');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleReply = async (id, reply) => {
    try {
      await axios.put(`http://localhost:4000/api/messages/${id}/reply`, { reply });
      setMessages(prev =>
        prev.map(m => (m._id === id ? { ...m, reply } : m))
      );
    } catch {
      alert('Lỗi khi trả lời.');
    }
  };

  if (loading) return <div className="text-amber-300 text-center mt-8">Đang tải tin nhắn...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="min-h-screen py-10 px-4 flex justify-center bg-[#1b1212]">
      <div className="w-full max-w-3xl bg-[#2d1e1e] rounded-xl p-6 shadow-lg text-white border border-amber-500">
        <h2 className="text-2xl font-bold text-amber-400 text-center mb-6">💬 Tin nhắn từ người dùng</h2>

        <div className="space-y-6">
          {messages.map(msg => (
            <div key={msg._id} className="bg-[#1f1414] border border-amber-400 rounded-lg p-4">
              <p className="text-white mb-1">
                <strong>👤 {msg.name || 'Người dùng'}:</strong> {msg.message}
              </p>
              <p className="text-sm text-gray-400 mb-2">📅 {new Date(msg.createdAt).toLocaleString()}</p>

              {msg.reply ? (
                <div className="bg-green-700/50 text-green-200 p-2 rounded-md">
                  <strong>💬 Admin:</strong> {msg.reply}
                </div>
              ) : (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    const reply = e.target.elements.reply.value.trim();
                    if (reply) handleReply(msg._id, reply);
                    e.target.reset();
                  }}
                  className="mt-2 flex gap-2"
                >
                  <input
                    type="text"
                    name="reply"
                    placeholder="Nhập phản hồi..."
                    className="flex-1 px-3 py-1.5 bg-[#3e2a2a] text-white rounded-lg outline-none text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-lg text-sm"
                  >
                    Gửi
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
