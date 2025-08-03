import express from 'express'
import Message from '../modals/messageModel.js'

const router = express.Router()

// Gửi tin nhắn (từ user)
router.post('/', async (req, res) => {
  try {
    const msg = new Message(req.body)
    await msg.save()
    res.status(201).json({ success: true, message: 'Tin nhắn đã được gửi.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi gửi tin.' })
  }
})

// Lấy tất cả tin nhắn (cho admin)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 }) // 🟢 sắp xếp từ cũ tới mới
    res.json(messages)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tải tin nhắn.' })
  }
})

// Admin trả lời tin
router.put('/:id/reply', async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, {
      reply: req.body.reply,
    }, { new: true })
    res.json(msg)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi trả lời.' })
  }
})

// ✅ Xoá tất cả tin nhắn
router.delete('/', async (req, res) => {
  try {
    await Message.deleteMany({})
    res.json({ success: true, message: 'Đã xoá tất cả tin nhắn.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi xoá tin nhắn.' })
  }
})

export default router
