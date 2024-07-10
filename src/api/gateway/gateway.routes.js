const express = require('express');
const router = express.Router();
const gatewayController = require('./gateway.controller');
const auth = require('../../middleware/auth.middleware');

// User Info
router.get('/user', auth, gatewayController.getUserInfo);

// Create or Join Chat Room
router.post('/chat', auth, gatewayController.createOrJoinChatRoom);

// User Chat Rooms
router.get('/chats', auth, gatewayController.getUserChatRooms);

// Chat History
router.get('/chats/:chatId/history', auth, gatewayController.getChatHistory);

// Send Message
router.post('/chats/:chatId/message', auth, gatewayController.sendMessage);

// Typing Notification
router.post('/chats/:chatId/typing', auth, gatewayController.typing);

// Mark Messages as Read
router.post('/chats/:chatId/read', auth, gatewayController.markAsRead);

module.exports = router;
