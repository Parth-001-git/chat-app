const userService = require('../user/user.service');
const chatService = require('../chat/chat.service');

// Get user information by ID
const getUserById = async (userId) => {
  try {
    const user = await userService.getUserById(userId);
    return user;
  } catch (err) {
    console.error(err.message);
    throw new Error('Failed to fetch user information');
  }
};

// Create or join a chat room
const createOrJoinChatRoom = async (userId, otherUserId) => {
  try {
    const chatRoom = await chatService.createOrJoinChatRoom(userId, otherUserId);
    return chatRoom;
  } catch (err) {
    console.error(err.message);
    throw new Error('Failed to create or join chat room');
  }
};

// Get user's chat rooms
const getUserChatRooms = async (userId) => {
  try {
    const chatRooms = await chatService.getUserChatRooms(userId);
    return chatRooms;
  } catch (err) {
    console.error(err.message);
    throw new Error('Failed to fetch user chat rooms');
  }
};

// Get chat history by chat ID
const getChatHistory = async (chatId) => {
  try {
    const messages = await chatService.getChatHistory(chatId);
    return messages;
  } catch (err) {
    console.error(err.message);
    throw new Error('Failed to fetch chat history');
  }
};

// Send a message to a chat room
const sendMessage = async (userId, chatId, content) => {
  try {
    const message = await chatService.sendMessage(userId, chatId, content);
    return message;
  } catch (err) {
    console.error(err.message);
    throw new Error('Failed to send message');
  }
};

// Notify typing status in a chat room
const notifyTyping = async (userId, chatId, isTyping) => {
  try {
    await chatService.notifyTyping(userId, chatId, isTyping);
  } catch (err) {
    console.error(err.message);
    throw new Error('Failed to notify typing status');
  }
};

// Mark messages as read in a chat room
const markMessagesAsRead = async (userId, chatId) => {
  try {
    await chatService.markMessagesAsRead(userId, chatId);
  } catch (err) {
    console.error(err.message);
    throw new Error('Failed to mark messages as read');
  }
};

module.exports = {
  getUserById,
  createOrJoinChatRoom,
  getUserChatRooms,
  getChatHistory,
  sendMessage,
  notifyTyping,
  markMessagesAsRead,
};
