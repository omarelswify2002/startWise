const User = require('../models/User');
const Startup = require('../models/Startup');
const Investor = require('../models/Investor');
const Advisor = require('../models/Advisor');
const Match = require('../models/Match');
const Message = require('../models/Message');
const Meeting = require('../models/Meeting');

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getPlatformStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStartups,
      totalInvestors,
      totalAdvisors,
      totalMatches,
      totalMessages,
      totalMeetings,
      usersByRole,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      Startup.countDocuments(),
      Investor.countDocuments(),
      Advisor.countDocuments(),
      Match.countDocuments(),
      Message.countDocuments(),
      Meeting.countDocuments(),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      User.find().sort({ createdAt: -1 }).limit(10).select('name email role createdAt isVerified')
    ]);

    // Match statistics
    const matchStats = await Match.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top performing startups (by matches)
    const topStartups = await Match.aggregate([
      {
        $group: {
          _id: '$startupId',
          matchCount: { $sum: 1 },
          avgScore: { $avg: '$score' }
        }
      },
      { $sort: { matchCount: -1 } },
      { $limit: 10 }
    ]);

    await Startup.populate(topStartups, { path: '_id', select: 'companyName sector stage' });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalStartups,
          totalInvestors,
          totalAdvisors,
          totalMatches,
          totalMessages,
          totalMeetings
        },
        usersByRole,
        matchStats,
        topStartups,
        recentUsers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform reports
// @route   GET /api/admin/reports
// @access  Private (Admin only)
exports.getReports = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    // User growth over time
    const userGrowth = await User.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Match success rate
    const matchSuccessRate = await Match.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          contacted: {
            $sum: {
              $cond: [
                { $in: ['$status', ['Contacted', 'In Discussion', 'Accepted']] },
                1,
                0
              ]
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

    // Sector distribution
    const sectorDistribution = await Startup.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$sector',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Stage distribution
    const stageDistribution = await Startup.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        userGrowth,
        matchSuccessRate: matchSuccessRate[0] || { total: 0, contacted: 0, accepted: 0 },
        sectorDistribution,
        stageDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify investor/advisor
// @route   PUT /api/admin/verify/:type/:id
// @access  Private (Admin only)
exports.verifyProfile = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const { isVerified } = req.body;

    let Model;
    if (type === 'investor') Model = Investor;
    else if (type === 'advisor') Model = Advisor;
    else {
      return res.status(400).json({
        success: false,
        error: 'Invalid type. Must be investor or advisor'
      });
    }

    const profile = await Model.findByIdAndUpdate(
      id,
      { isVerified },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: `${type} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify user
// @route   PUT /api/admin/users/:id/verify
// @access  Private (Admin only)
exports.verifyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.isVerified = true;
    user.verifiedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};