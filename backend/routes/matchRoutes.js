const express = require('express');
const {
  generateMatches,
  getMatches,
  getMatch,
  updateMatchStatus,
  deleteMatch,
  getMatchStats,
  getMatchesForInvestor,
  getMatchesForAdvisor
} = require('../controllers/matchController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/generate', protect, authorize('Startup', 'Admin'), generateMatches);
router.get('/investor/:investorId', protect, getMatchesForInvestor);
router.get('/advisor/:advisorId', protect, getMatchesForAdvisor);
router.get('/:startupId', protect, getMatches);
router.get('/detail/:id', protect, getMatch);
router.put('/:id/status', protect, updateMatchStatus);
router.delete('/:id', protect, deleteMatch);
router.get('/:startupId/stats', protect, getMatchStats);

module.exports = router;

