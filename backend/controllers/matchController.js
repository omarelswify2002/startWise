const Match = require('../models/Match');
const Startup = require('../models/Startup');
const { matchStartupWithInvestors, matchStartupWithAdvisors } = require('../services/matchingService');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// @desc    Generate matches for a startup
// @route   POST /api/matches/generate
// @access  Private (Startup role)
exports.generateMatches = async (req, res, next) => {
  try {
    const { startupId } = req.body;

    // Verify startup exists and user owns it
    const startup = await Startup.findById(startupId);
    
    if (!startup) {
      return res.status(404).json({
        success: false,
        error: 'Startup not found'
      });
    }

    if (startup.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to generate matches for this startup'
      });
    }

    // Generate matches with investors and advisors
    const [investorMatches, advisorMatches] = await Promise.all([
      matchStartupWithInvestors(startupId),
      matchStartupWithAdvisors(startupId)
    ]);

    res.status(200).json({
      success: true,
      data: {
        investors: investorMatches,
        advisors: advisorMatches,
        totalMatches: investorMatches.length + advisorMatches.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get matches for a startup
// @route   GET /api/matches/:startupId
// @access  Private
exports.getMatches = async (req, res, next) => {
  try {
    const { startupId } = req.params;
    const { type, status, page = 1, limit = 10 } = req.query;

    // Verify startup exists
    const startup = await Startup.findById(startupId);
    
    if (!startup) {
      return res.status(404).json({
        success: false,
        error: 'Startup not found'
      });
    }

    // Build query
    let query = { startupId, isActive: true };
    if (type) query.type = type;
    if (status) query.status = status;

    // Get matches with pagination
    const matches = await Match.find(query)
      .populate({
        path: 'candidateId',
        select: '-__v',
        populate: {
          path: 'userId',
          select: 'name email role profile.avatar'
        }
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ score: -1, createdAt: -1 });

    const count = await Match.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: matches
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single match
// @route   GET /api/matches/detail/:id
// @access  Private
exports.getMatch = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('startupId')
      .populate('candidateId');

    if (!match) {
      return res.status(404).json({
        success: false,
        error: 'Match not found'
      });
    }

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update match status
// @route   PUT /api/matches/:id/status
// @access  Private
exports.updateMatchStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    let match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        error: 'Match not found'
      });
    }

    // Update status
    match.status = status;
    if (notes) match.notes = notes;

    // Update timestamps based on status
    if (status === 'Viewed' && !match.viewedAt) {
      match.viewedAt = Date.now();
    }
    if (status === 'Contacted' && !match.contactedAt) {
      match.contactedAt = Date.now();
    }

    await match.save();

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete match
// @route   DELETE /api/matches/:id
// @access  Private
exports.deleteMatch = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        error: 'Match not found'
      });
    }

    match.isActive = false;
    await match.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get match statistics for a startup
// @route   GET /api/matches/:startupId/stats
// @access  Private
exports.getMatchStats = async (req, res, next) => {
  try {
    const { startupId } = req.params;

    const stats = await Match.aggregate([
      { $match: { startupId: require('mongoose').Types.ObjectId(startupId), isActive: true } },
      {
        $group: {
          _id: '$type',
          total: { $sum: 1 },
          avgScore: { $avg: '$score' },
          contacted: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Contacted'] }, 1, 0]
            }
          },
          accepted: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get matches for an investor (startups that matched with them)
// @route   GET /api/matches/investor/:investorId
// @access  Private
exports.getMatchesForInvestor = async (req, res, next) => {
  try {
    const { investorId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    let query = { candidateId: investorId, candidateModel: 'Investor', isActive: true };
    if (status) query.status = status;

    // Get matches with pagination
    const matches = await Match.find(query)
      .populate({
        path: 'startupId',
        select: '-__v',
        populate: {
          path: 'userId',
          select: 'name email role profile.avatar'
        }
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ score: -1, createdAt: -1 });

    const count = await Match.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: matches
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get matches for an advisor (startups that matched with them)
// @route   GET /api/matches/advisor/:advisorId
// @access  Private
exports.getMatchesForAdvisor = async (req, res, next) => {
  try {
    const { advisorId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    let query = { candidateId: advisorId, candidateModel: 'Advisor', isActive: true };
    if (status) query.status = status;

    // Get matches with pagination
    const matches = await Match.find(query)
      .populate({
        path: 'startupId',
        select: '-__v',
        populate: {
          path: 'userId',
          select: 'name email role profile.avatar'
        }
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ score: -1, createdAt: -1 });

    const count = await Match.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: matches
    });
  } catch (error) {
    next(error);
  }
};



