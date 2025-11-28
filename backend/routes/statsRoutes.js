const express = require('express');
const { getPublicStats } = require('../controllers/statsController');

const router = express.Router();

// Public route - no authentication required
router.get('/public', getPublicStats);

module.exports = router;

