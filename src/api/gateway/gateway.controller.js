const express = require('express');
const userService = require('../user/user.service');
const chatService = require('../chat/chat.service');
const auth = require('../../middleware/auth.middleware');

// Get user information
exports.getUserInfo = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create or join a chat room
exports.createOrJoinChatRoom = async (req, res) => {
  const { userId, otherUserId } = req.body;
  try {
    const chatRoom = await chatService.createOrJoinChatRoom(userId, otherUserId);
    res.json(chatRoom);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Fetch chat rooms for a user
exports.getUserChatRooms = async (req, res) => {
  try {
    const chatRooms = await chatService.getUserChatRooms(req.user.id);
    res.json(chatRooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Fetch chat history for a chat room
exports.getChatHistory = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await chatService.getChatHistory(chatId);
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

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

// Typing notification
exports.typing = async (req, res) => {
  const { chatId, isTyping } = req.body;
  try {
    await chatService.notifyTyping(chatId, req.user.id, isTyping);
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
