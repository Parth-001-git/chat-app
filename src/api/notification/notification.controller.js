const Notification = require('../models/notification.model');
const User = require('../models/user.model');

// Send a notification to a user
exports.sendNotification = async (req, res) => {
  const { userId, message } = req.body;
  
  try {
    // Create a new notification
    const notification = new Notification({
      user: userId,
      message
    });

    await notification.save();

    // Emit real-time notification event using socket.io or similar library
    global.io.emit('newNotification', notification);

    res.json(notification);
  } catch (err) {
    console.error('Error in sendNotification controller:', err.message);
    res.status(500).send('Server error');
  }
};

// Get notifications for a specific user
exports.getNotifications = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find all notifications for the user
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'username');

    res.json(notifications);
  } catch (err) {
    console.error('Error in getNotifications controller:', err.message);
    res.status(500).send('Server error');
  }
};

// Mark notifications as read for a specific user
exports.markNotificationsAsRead = async (req, res) => {
  const userId = req.user.id;

  try {
    // Update all unread notifications to mark as read
    await Notification.updateMany({ user: userId, read: false }, { $set: { read: true } });

    // Emit real-time event to update client-side notifications
    global.io.emit('notificationsRead', { userId });

    res.sendStatus(200);
  } catch (err) {
    console.error('Error in markNotificationsAsRead controller:', err.message);
    res.status(500).send('Server error');
  }
};
