const chatService = require('./chat.service');

// Send a message
exports.sendMessage = async (req, res) => {
  const { chatId, content } = req.body;

  try {
    const message = await chatService.sendMessage(req.user.id, chatId, content);
    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get chat history
exports.getChatHistory = async (req, res) => {
  try {
    const messages = await chatService.getChatHistory(req.params.chatId);
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Notify when a user is typing
exports.typing = (req, res) => {
  const { chatId, isTyping } = req.body;

  try {
    chatService.notifyTyping(chatId, req.user.id, isTyping);
    res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  const { chatId } = req.body;

  try {
    await chatService.markMessagesAsRead(chatId, req.user.id);
    res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
