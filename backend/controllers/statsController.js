const User = require('../models/User');
const Startup = require('../models/Startup');
const Investor = require('../models/Investor');
const Advisor = require('../models/Advisor');
const Match = require('../models/Match');

// @desc    Get public platform statistics
// @route   GET /api/stats/public
// @access  Public
exports.getPublicStats = async (req, res) => {
  try {
    // Count users by role
    const startupCount = await User.countDocuments({ role: 'Startup' });
    const investorCount = await User.countDocuments({ role: 'Investor' });
    const advisorCount = await User.countDocuments({ role: 'Advisor' });
    
    // Count total matches made
    const matchCount = await Match.countDocuments();

    res.json({
      success: true,
      data: {
        startups: startupCount,
        investors: investorCount,
        advisors: advisorCount,
        matches: matchCount
      }
    });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching platform statistics'
    });
  }
};

