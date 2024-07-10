const Message = require('../models/message.model');
const Chat = require('../models/chat.model');

// Send a message to a chat room
exports.sendMessage = async (senderId, chatId, content) => {
  try {
    const message = new Message({
      sender: senderId,
      chatRoom: chatId,
      content,
    });

    await message.save();

    // Update last message in chat
    await Chat.findByIdAndUpdate(chatId, { lastMessage: message }, { new: true });

    return message;
  } catch (err) {
    console.error('Error in sendMessage service:', err.message);
    throw err;
  }
};

// Get chat history for a specific chat room
exports.getChatHistory = async (chatId) => {
  try {
    const messages = await Message.find({ chatRoom: chatId })
      .populate('sender', 'username')
      .sort({ createdAt: 1 }); // Sort by ascending createdAt for chronological order

    return messages;
  } catch (err) {
    console.error('Error in getChatHistory service:', err.message);
    throw err;
  }
};

// Mark messages as read in a chat room for a specific user
exports.markAsRead = async (chatId, userId) => {
  try {
    await Message.updateMany(
      { chatRoom: chatId, receiver: userId, read: false },
      { $set: { read: true } }
    );

    return true;
  } catch (err) {
    console.error('Error in markAsRead service:', err.message);
    throw err;
  }
};
