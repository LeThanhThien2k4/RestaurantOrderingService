import React, { useState } from "react";

const ChatBot = ({ embedMode = false }) => {
  const [isOpen, setIsOpen] = useState(embedMode);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào 👋! Tôi là Chatbot AI tư vấn đặt món. Bạn muốn gọi món gì hôm nay?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");

    try {
      const res = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { from: "bot", text: "❌ Lỗi kết nối server" }]);
    }
  };

  const handleKeyPress = (e) => e.key === "Enter" && sendMessage();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-3 overflow-y-auto bg-[#fffaf5] flex flex-col gap-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${
              msg.from === "user"
                ? "self-end bg-orange-200"
                : "self-start bg-orange-100"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2 p-3 bg-[#f9f9f9]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập câu hỏi..."
          className="flex-1 border border-gray-300 rounded-md px-3 py-1"
        />
        <button
          onClick={sendMessage}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-md"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
