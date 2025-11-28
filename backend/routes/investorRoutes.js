const express = require('express');
const {
  getInvestors,
  getInvestor,
  createInvestor,
  updateInvestor,
  deleteInvestor,
  getInvestorByUserId
} = require('../controllers/investorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getInvestors)
  .post(protect, authorize('Investor', 'Admin'), createInvestor);

router.route('/:id')
  .get(getInvestor)
  .put(protect, updateInvestor)
  .delete(protect, deleteInvestor);

router.get('/user/:userId', getInvestorByUserId);

module.exports = router;

