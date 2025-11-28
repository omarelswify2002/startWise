const express = require('express');
const {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead,
  getUnreadCount,
  deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/conversation/:userId', protect, getConversation);
router.put('/read/:userId', protect, markAsRead);
router.get('/unread/count', protect, getUnreadCount);
router.delete('/:id', protect, deleteMessage);

module.exports = router;

