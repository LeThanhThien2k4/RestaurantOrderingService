    import express from 'express';
    import { createMessage, getMessages, replyMessage } from '../controllers/chatController.js';

    const router = express.Router();

    router.post('/send', createMessage); // user gửi
    router.get('/:userId', getMessages); // admin xem
    router.post('/reply', replyMessage); // admin trả lời

    export default router;
