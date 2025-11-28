const express = require('express');
const {
  createMeeting,
  getMeetings,
  getMeeting,
  updateMeeting,
  respondToMeeting,
  cancelMeeting,
  getPendingMeetingsCount
} = require('../controllers/meetingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getMeetings)
  .post(protect, createMeeting);

router.get('/pending/count', protect, getPendingMeetingsCount);

router.route('/:id')
  .get(protect, getMeeting)
  .put(protect, updateMeeting)
  .delete(protect, cancelMeeting);

router.put('/:id/respond', protect, respondToMeeting);

module.exports = router;

