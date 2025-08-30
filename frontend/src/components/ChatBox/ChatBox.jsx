import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Hàm format thời gian HH:mm
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

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
        message: input,
        // timestamp backend tự thêm, hoặc bạn có thể thêm timestamp: new Date().toISOString()
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
      {!showBox && (
        <button
          onClick={() => setShowBox(true)}
          className="fixed bottom-5 right-5 bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-full shadow-lg z-50 transition"
          aria-label="Mở hộp chat"
        >
          💬 Hỏi đáp
        </button>
      )}

      {showBox && (
        <div className="fixed bottom-5 right-5 w-96 max-w-full bg-[#3a1f0c] rounded-2xl shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="flex justify-between items-center bg-orange-700 rounded-t-2xl px-6 py-3">
            <h3 className="text-lg font-bold text-white tracking-wide select-none">HỎI ĐÁP</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDeleteAll}
                className="text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition 
                           px-3 py-1 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
                title="Xoá tất cả tin nhắn"
              >
                Xoá tất cả
              </button>
              <button
                onClick={() => setShowBox(false)}
                className="bg-orange-600 hover:bg-orange-800 text-white px-3 py-1 rounded-lg shadow-md transition focus:outline-none"
                aria-label="Ẩn hộp chat"
              >
                Ẩn
              </button>
            </div>
          </div>

          {/* Nội dung tin nhắn */}
          <div
            className="flex-1 overflow-y-auto p-4 bg-[#2f1606] rounded-b-2xl flex flex-col gap-4 max-h-80 scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-orange-100/10"
            style={{ scrollbarWidth: 'thin' }}
          >
            {messages.map((msg, i) => (
              <div key={i} className="w-full flex flex-col gap-1">
                {/* Tin nhắn user bên phải */}
                <div
                  className="self-end max-w-[70%] bg-white text-black rounded-2xl rounded-br-none px-5 py-3 shadow-md text-right break-words"
                  style={{ wordBreak: 'break-word' }}
                >
                  {msg.message}
                  {msg.timestamp && (
                    <div className="text-xs text-gray-500 mt-1 select-none">
                      {formatTime(msg.timestamp)}
                    </div>
                  )}
                </div>

                {/* Reply (admin) nếu có, hiện dòng dưới bên trái */}
                {msg.reply && (
                  <div
                    className="self-start max-w-[70%] bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 text-white rounded-2xl rounded-bl-none px-5 py-3 shadow-lg break-words flex items-center gap-2"
                    style={{ wordBreak: 'break-word' }}
                  >
                    <span className="select-none">👨‍💼</span>
                    <span>{msg.reply}</span>
                    {msg.timestamp && (
                      <div className="text-xs text-orange-200 mt-1 select-none ml-auto">
                        {formatTime(msg.timestamp)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input gửi tin */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3 px-4 py-3 bg-[#3a1f0c] rounded-b-2xl"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-grow bg-[#5a3b1a] placeholder-orange-300 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              autoComplete="off"
            />
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-800 text-white px-5 py-2 rounded-full shadow-lg transition"
              aria-label="Gửi tin nhắn"
            >
              Gửi
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBox;
