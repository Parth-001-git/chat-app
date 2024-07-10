const Notification = require('../models/notification.model');
const User = require('../models/user.model');

// Send a notification to a user
exports.sendNotification = async (userId, message) => {
  try {
    // Create a new notification
    const notification = new Notification({
      user: userId,
      message
    });

    await notification.save();

    // Example: Emit real-time notification event using socket.io or similar library
    // global.io.emit('newNotification', notification);

    return notification;
  } catch (err) {
    console.error('Error in sendNotification service:', err.message);
    throw new Error('Failed to send notification');
  }
};

// Get notifications for a specific user
exports.getNotifications = async (userId) => {
  try {
    // Find all notifications for the user
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'username');

    return notifications;
  } catch (err) {
    console.error('Error in getNotifications service:', err.message);
    throw new Error('Failed to get notifications');
  }
};

// Mark notifications as read for a specific user
exports.markNotificationsAsRead = async (userId) => {
  try {
    // Update all unread notifications to mark as read
    const result = await Notification.updateMany({ user: userId, read: false }, { $set: { read: true } });

    return result;
  } catch (err) {
    console.error('Error in markNotificationsAsRead service:', err.message);
    throw new Error('Failed to mark notifications as read');
  }
};
