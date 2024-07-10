const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth.middleware');
const notificationController = require('./notification.controller');

// Route: POST /api/notifications/send
// Description: Send a notification to a user
// Access: Private (requires authentication)
router.post(
  '/send',
  auth,
  [
    check('userId', 'User ID is required').not().isEmpty(),
    check('message', 'Message is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    notificationController.sendNotification(req, res);
  }
);

// Route: GET /api/notifications
// Description: Get notifications for the authenticated user
// Access: Private (requires authentication)
router.get('/', auth, notificationController.getNotifications);

// Route: POST /api/notifications/read
// Description: Mark notifications as read for the authenticated user
// Access: Private (requires authentication)
router.post('/read', auth, notificationController.markNotificationsAsRead);

module.exports = router;
