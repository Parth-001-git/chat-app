const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
  type: { type: String, required: true },  // e.g., "typing", "read"
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
