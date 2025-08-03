import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatBox = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [showBox, setShowBox] = useState(true);
  const bottomRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/api/messages');
      setMessages(data || []);
    } catch (err) {
      console.error('Lỗi lấy tin nhắn:', err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      await axios.post('http://localhost:4000/api/messages', {
        sender: 'user',
        name: 'Khách',
        message: input
      });
      setInput('');
      await fetchMessages();
    } catch (err) {
      console.error('Lỗi gửi tin:', err);
      alert('Gửi tin nhắn thất bại!');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá tất cả tin nhắn?')) return;
    try {
      await axios.delete('http://localhost:4000/api/messages');
      setMessages([]);
    } catch (err) {
      console.error('Lỗi xoá tin nhắn:', err);
      alert('Xoá tin nhắn thất bại!');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* Nút mở */}
      {!showBox && (
        <button
          onClick={() => setShowBox(true)}
          className="fixed bottom-4 right-4 bg-amber-500 text-white px-4 py-2 rounded z-50 shadow-xl"
        >
          Hiện hỏi đáp
        </button>
      )}

      {/* Hộp chat */}
      {showBox && (
        <div className="fixed bottom-4 right-4 bg-[#2d1e1e] rounded-xl p-4 w-80 shadow-xl z-50">
          {/* Header */}
<div className="flex justify-between items-center mb-2">
  <h3 className="text-lg font-semibold text-amber-400">Hỏi đáp</h3>
  <div className="flex items-center gap-4">
    <button
      onClick={handleDeleteAll}
      className="text-sm text-red-400 hover:underline"
    >
      Xoá tất cả
    </button>
    <button
      onClick={() => setShowBox(false)}
      className="text-sm text-white bg-amber-500/20 px-2 py-1 rounded hover:bg-amber-600/30"
    >
      Ẩn
    </button>
  </div>
</div>


          {/* Nội dung tin nhắn */}
          <div className="h-60 overflow-y-auto bg-[#1f1414] rounded p-2 text-sm flex flex-col">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 mb-2 rounded-lg break-words ${
                  msg.sender === 'user'
                    ? 'bg-white text-black text-right self-end'
                    : 'bg-amber-200/10 text-white text-left self-start'
                }`}
              >
                {msg.message}
                {msg.reply && (
                  <div className="text-xs text-green-300 mt-1">
                    👨‍💼 {msg.reply}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Gửi tin nhắn */}
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-2 py-1 bg-[#3e2a2a] rounded text-white"
            />
            <button
              onClick={handleSend}
              className="bg-amber-500 px-3 py-1 rounded text-white"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
