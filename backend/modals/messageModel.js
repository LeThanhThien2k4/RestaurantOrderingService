import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },       // 'user' hoặc 'admin'
  name: { type: String },                         // Tên người gửi
  message: { type: String, required: true },      // Nội dung tin nhắn
  createdAt: { type: Date, default: Date.now },   // Thời gian gửi
  reply: { type: String },                        // Trả lời từ admin (nếu có)
})

export default mongoose.model('Message', messageSchema)
