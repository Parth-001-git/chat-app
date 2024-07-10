const io = require('../server').io; // Import the Socket.io instance from server.js
const User = require('../models/User');

// Send a notification to a specific user
const sendNotification = (userId, event, data) => {
    io.to(userId).emit(event, data);
};

// Notify users in a chat about a new message
const notifyNewMessage = async (chatId, message) => {
    try {
        const chatUsers = await Chat.findById(chatId).select('users -_id').populate('users', 'socketId');
        
        if (!chatUsers) {
            throw new Error('Chat not found');
        }

        chatUsers.users.forEach(user => {
            if (user.socketId) {
                sendNotification(user.socketId, 'newMessage', message);
            }
        });
    } catch (error) {
        console.error('Error notifying users about new message: ', error.message);
    }
};

// Notify users in a chat when a user starts typing
const notifyTyping = (chatId, userId) => {
    io.to(chatId).emit('typing', userId);
};

// Notify users in a chat when a user stops typing
const notifyStopTyping = (chatId, userId) => {
    io.to(chatId).emit('stopTyping', userId);
};

module.exports = {
    sendNotification,
    notifyNewMessage,
    notifyTyping,
    notifyStopTyping,
};
