const Message = require('../../models/message.model');
const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');

// Send a message
const sendMessage = async (senderId, chatId, content) => {
  const message = new Message({
    sender: senderId,
    chatRoom: chatId,
    content,
  });

  await message.save();

  // Notify other members
  const chat = await Chat.findById(chatId).populate('members', 'username');
  chat.members.forEach(member => {
    if (member.id !== senderId) {
      // Emit real-time message event to other members
      global.io.to(member.id).emit('newMessage', message);
    }
  });

  return message;
};

// Get chat history
const getChatHistory = async (chatId) => {
  const messages = await Message.find({ chatRoom: chatId })
    .populate('sender', 'username')
    .sort({ createdAt: -1 });

  return messages;
};

// Notify when a user is typing
const notifyTyping = (chatId, userId, isTyping) => {
  // Emit typing event to other members
  global.io.to(chatId).emit('typing', { userId, isTyping });
};

// Mark messages as read
const markMessagesAsRead = async (chatId, userId) => {
  await Message.updateMany(
    { chatRoom: chatId, receiver: userId, read: false },
    { $set: { read: true } }
  );

  // Notify sender that messages are read
  global.io.to(chatId).emit('messagesRead', { chatId, userId });
};

module.exports = {
  sendMessage,
  getChatHistory,
  notifyTyping,
  markMessagesAsRead,
};
