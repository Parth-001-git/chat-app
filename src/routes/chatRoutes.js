const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
    createChat,
    getChats,
    getChatById,
    addUserToChat,
    removeUserFromChat,
} = require('../controllers/chatController');

// Route to create a new chat
router.post('/', protect, createChat);

// Route to get all chats for the authenticated user
router.get('/', protect, getChats);

// Route to get details of a specific chat by ID
router.get('/:id', protect, getChatById);

// Route to add a user to a chat
router.put('/addUser', protect, addUserToChat);

// Route to remove a user from a chat
router.put('/removeUser', protect, removeUserFromChat);

module.exports = router;
