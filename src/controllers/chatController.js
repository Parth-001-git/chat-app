const Chat = require('../models/Chat');
const User = require('../models/User');

// Create a new chat
exports.createChat = async (req, res) => {
    const { name, userIds } = req.body;

    try {
        if (!name || !userIds || userIds.length === 0) {
            return res.status(400).json({ message: 'Name and user IDs are required' });
        }

        // Include the current user in the chat
        userIds.push(req.user._id);

        const chat = new Chat({ name, users: userIds });
        const createdChat = await chat.save();

        const fullChat = await Chat.findById(createdChat._id)
            .populate('users', 'name email');

        res.status(201).json(fullChat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all chats for the authenticated user
exports.getChats = async (req, res) => {
    try {
        const chats = await Chat.find({ users: req.user._id })
            .populate('users', 'name email')
            .populate('latestMessage');

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get details of a specific chat
exports.getChatById = async (req, res) => {
    const chatId = req.params.id;

    try {
        const chat = await Chat.findById(chatId)
            .populate('users', 'name email')
            .populate('latestMessage');

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a user to a chat
exports.addUserToChat = async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        if (chat.users.includes(userId)) {
            return res.status(400).json({ message: 'User already in chat' });
        }

        chat.users.push(userId);
        await chat.save();

        const updatedChat = await Chat.findById(chatId).populate('users', 'name email');

        res.status(200).json(updatedChat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove a user from a chat
exports.removeUserFromChat = async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        if (!chat.users.includes(userId)) {
            return res.status(400).json({ message: 'User not in chat' });
        }

        // Remove the user from the chat
        chat.users = chat.users.filter(user => user.toString() !== userId);
        await chat.save();

        const updatedChat = await Chat.findById(chatId).populate('users', 'name email');

        res.status(200).json(updatedChat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
