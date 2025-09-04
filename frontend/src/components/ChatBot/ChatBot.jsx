import { hover } from "framer-motion";
import React, { useState } from "react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào 👋! Tôi là Chatbot AI tư vấn đặt món. Bạn muốn gọi món gì hôm nay?" }
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

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

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "❌ Lỗi kết nối server" },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div>
      {isOpen && (
        <div style={styles.chatBox}>
          <div style={styles.header}>
            <span>Chatbot AI 🤖</span>
            <button onClick={toggleChat} style={styles.closeBtn}>×</button>
          </div>
          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.message,
                  alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.from === "user" ? "#ffcc80" : "#fff3e0",
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div style={styles.inputArea}>
            <input
              type="text"
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              style={styles.input}
            />
            <button onClick={sendMessage} style={styles.sendBtn}>Gửi</button>
          </div>
        </div>
      )}

      {/* Nút mở Chatbot */}
      <button onClick={toggleChat} style={styles.toggleBtn}>
        Chatbot AI
      </button>
    </div>
  );
};

const styles = {
  chatBox: {
    position: "fixed",
    bottom: "150px",
    right: "20px",
    width: "320px",
    height: "400px",
    backgroundColor: "#2c1a0e", // nền nâu đậm
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 1000,
  },
  header: {
    backgroundColor: "#3b1e0a", // header nâu
    color: "#ffb84d", // chữ vàng
    padding: "10px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
  },
  messages: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    backgroundColor: "#fffaf5", // nền chat nhạt
  },
  message: {
    maxWidth: "70%",
    padding: "8px 12px",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#2c1a0e",
  },
  inputArea: {
    display: "flex",
    borderTop: "1px solid #ddd",
    padding: "8px",
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    padding: "6px 10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginRight: "6px",
  },
  sendBtn: {
    backgroundColor: "#ff6600", // nút cam
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  toggleBtn: {
    position: "fixed",
    bottom: "100px",
    right: "20px",
    backgroundColor: "#ff6600", // nút cam
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    padding: "10px 20px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    zIndex: 1000,
    fontWeight: "bold",
  },
};

export default ChatBot;
