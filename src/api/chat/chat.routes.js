const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.middleware');
const chatController = require('./chat.controller');

// Send a message
router.post('/send', auth, chatController.sendMessage);

// Get chat history
router.get('/history/:chatId', auth, chatController.getChatHistory);

// Notify when a user is typing
router.post('/typing', auth, chatController.typing);

// Mark messages as read
router.post('/read', auth, chatController.markAsRead);

module.exports = router;
