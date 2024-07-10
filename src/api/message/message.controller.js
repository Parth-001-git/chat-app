const Message = require('../../models/message.model');
const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');
const messageService = require('../services/message.service');

// Send a message
exports.sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  try {
    const message = new Message({
      sender: req.user.id,
      chatRoom: chatId,
      content,
    });

    await message.save();

    // Notify other members
    const chat = await Chat.findById(chatId).populate('members', 'username');
    chat.members.forEach(member => {
      if (member.id !== req.user.id) {
        // Emit real-time message event to other members
        global.io.to(member.id).emit('newMessage', message);
      }
    });

    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get chat history
exports.getChatHistory = async (req, res) => {
  try {
    const messages = await Message.find({ chatRoom: req.params.chatId })
      .populate('sender', 'username')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Notify when a user is typing
exports.typing = (req, res) => {
  const { chatId, isTyping } = req.body;
  const userId = req.user.id;

  // Emit typing event to other members
  global.io.to(chatId).emit('typing', { userId, isTyping });

  res.sendStatus(200);
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  const { chatId } = req.body;
  const userId = req.user.id;

  try {
    await Message.updateMany(
      { chatRoom: chatId, receiver: userId, read: false },
      { $set: { read: true } }
    );

    // Notify sender that messages are read
    global.io.to(chatId).emit('messagesRead', { chatId, userId });

    res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
