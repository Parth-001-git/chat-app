const Message = require('../models/Message');
const Chat = require('../models/Chat');

// Send a message
exports.sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    try {
        if (!content || !chatId) {
            return res.status(400).json({ message: 'Content and chatId are required' });
        }

        // Create a new message
        const message = await Message.create({ sender: req.user._id, content, chat: chatId });

        // Update latestMessage in the chat
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

        res.status(201).json(message);
    } catch (error) {
        console.error('Error sending message:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get messages for a chat
exports.getMessages = async (req, res) => {
    const { chatId } = req.params;

    try {
        // Find messages for the specified chat
        const messages = await Message.find({ chat: chatId }).populate('sender', 'name');

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error getting messages:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
