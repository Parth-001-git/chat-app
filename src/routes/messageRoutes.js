const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const { protect } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:chatId', protect, getMessages);

module.exports = router;