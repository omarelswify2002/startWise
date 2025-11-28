const express = require('express');
const {
  getAdvisors,
  getAdvisor,
  createAdvisor,
  updateAdvisor,
  deleteAdvisor,
  addReview,
  getAdvisorByUserId
} = require('../controllers/advisorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getAdvisors)
  .post(protect, authorize('Advisor', 'Admin'), createAdvisor);

router.route('/:id')
  .get(getAdvisor)
  .put(protect, updateAdvisor)
  .delete(protect, deleteAdvisor);

router.post('/:id/reviews', protect, addReview);

router.get('/user/:userId', getAdvisorByUserId);

module.exports = router;

