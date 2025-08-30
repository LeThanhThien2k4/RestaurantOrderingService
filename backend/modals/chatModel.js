import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // 'user' hoặc 'admin'
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  messages: [messageSchema]
});

export default mongoose.model('Chat', chatSchema);
