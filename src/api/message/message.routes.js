const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.middleware');
const messageController = require('./message.controller');

// Route: POST /api/messages/send
// Description: Send a message to a chat room
// Access: Private (requires authentication)
router.post('/send', auth, messageController.sendMessage);

// Route: GET /api/messages/history/:chatId
// Description: Get chat history for a specific chat room
// Access: Private (requires authentication)
router.get('/history/:chatId', auth, messageController.getChatHistory);

// Route: POST /api/messages/typing
// Description: Notify typing status in a chat room
// Access: Private (requires authentication)
router.post('/typing', auth, messageController.typing);

// Route: POST /api/messages/read
// Description: Mark messages as read in a chat room
// Access: Private (requires authentication)
router.post('/read', auth, messageController.markAsRead);

module.exports = router;
