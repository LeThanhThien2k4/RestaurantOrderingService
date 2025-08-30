import Chat from '../models/chatModel.js';

export const createMessage = async (req, res) => {
  const { userId, content } = req.body;
  try {
    let chat = await Chat.findOne({ userId });
    const message = { sender: 'user', content };
    if (!chat) {
      chat = await Chat.create({ userId, messages: [message] });
    } else {
      chat.messages.push(message);
      await chat.save();
    }
    res.json({ success: true, chat });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getMessages = async (req, res) => {
  const { userId } = req.params;
  const chat = await Chat.findOne({ userId });
  res.json(chat);
};

export const replyMessage = async (req, res) => {
  const { userId, content } = req.body;
  const chat = await Chat.findOne({ userId });
  if (!chat) return res.status(404).json({ error: 'Chat not found' });
  chat.messages.push({ sender: 'admin', content });
  await chat.save();
  res.json({ success: true, chat });
};
