import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Kiểm tra có API key không
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Chưa có GEMINI_API_KEY trong .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Dùng model Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Bạn là nhân viên CSKH của quán ăn FoodieFrenzy 🍔🍕🥤.
      Hãy trả lời ngắn gọn, thân thiện, dễ hiểu và phù hợp với khách hàng.
      Các nhiệm vụ bạn hỗ trợ:
      - Giới thiệu menu món ăn, thức uống.
      - Thông báo khuyến mãi, combo.
      - Hướng dẫn đặt món, thời gian giao hàng.
      - Giải đáp thông tin cơ bản về quán (giờ mở cửa, địa chỉ).

      Nếu khách hỏi ngoài chủ đề,
      bạn chỉ cần trả lời: "Xin lỗi, tôi chỉ hỗ trợ về dịch vụ đặt đồ ăn của quán FoodieFrenzy thôi ạ.Nếu bạn cần nhiều thông tin quan trọng hơn xin vui lòng liên hệ theo số điện thoại này 0902525481"

      Tin nhắn của khách: ${message}
    `;

    // Gọi Gemini
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("❌ Gemini API error:", error.message, error.stack);
    res.status(500).json({ error: "Chatbot bị lỗi, vui lòng thử lại sau." });
  }
});

export default router;
