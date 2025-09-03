import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatBox = ({ embedMode = false }) => {
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

  // Nếu embedMode thì bỏ nút mở/đóng riêng
  if (embedMode) {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Nội dung tin nhắn */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#2f1606] flex flex-col gap-4 max-h-80 scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-orange-100/10">
          {messages.map((msg, i) => (
            <div key={i} className="w-full flex flex-col gap-1">
              <div className="self-end max-w-[70%] bg-white text-black rounded-2xl rounded-br-none px-5 py-3 shadow-md text-right break-words">
                {msg.message}
                {msg.timestamp && (
                  <div className="text-xs text-gray-500 mt-1">{formatTime(msg.timestamp)}</div>
                )}
              </div>
              {msg.reply && (
                <div className="self-start max-w-[70%] bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 text-white rounded-2xl rounded-bl-none px-5 py-3 shadow-lg flex items-center gap-2">
                  <span>👨‍💼</span>
                  <span>{msg.reply}</span>
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3 px-4 py-3 bg-[#3a1f0c]"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-grow bg-[#5a3b1a] text-white px-4 py-2 rounded-full"
          />
          <button type="submit" className="bg-orange-600 hover:bg-orange-800 text-white px-5 py-2 rounded-full shadow-lg">
            Gửi
          </button>
        </form>
      </div>
    );
  }

  return null; // Chế độ cũ không dùng nữa
};

export default ChatBox;
