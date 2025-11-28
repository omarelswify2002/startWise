const Investor = require('../models/Investor');

// @desc    Get all investors
// @route   GET /api/investors
// @access  Public
exports.getInvestors = async (req, res, next) => {
  try {
    const { sector, stage, minInvestment, maxInvestment, page = 1, limit = 10 } = req.query;

    // Build query
    let query = { isActive: true };

    if (sector) query.sectors = sector;
    if (stage) query.preferredStages = stage;
    if (minInvestment || maxInvestment) {
      query['investmentRange.min'] = {};
      if (minInvestment) query['investmentRange.min'].$gte = minInvestment;
      if (maxInvestment) query['investmentRange.max'].$lte = maxInvestment;
    }

    // Execute query with pagination
    const investors = await Investor.find(query)
      .populate('userId', 'name email profile')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Investor.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: investors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single investor
// @route   GET /api/investors/:id
// @access  Public
exports.getInvestor = async (req, res, next) => {
  try {
    const investor = await Investor.findById(req.params.id)
      .populate('userId', 'name email profile');

    if (!investor) {
      return res.status(404).json({
        success: false,
        error: 'Investor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: investor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new investor profile
// @route   POST /api/investors
// @access  Private (Investor role)
exports.createInvestor = async (req, res, next) => {
  try {
    req.body.userId = req.user._id;

    // Check if user already has an investor profile
    const existingInvestor = await Investor.findOne({ userId: req.user._id });
    if (existingInvestor) {
      return res.status(400).json({
        success: false,
        error: 'You already have an investor profile. Please update it instead.'
      });
    }

    const investor = await Investor.create(req.body);

    res.status(201).json({
      success: true,
      data: investor
    });
  } catch (error) {
    console.error('Investor creation error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Server error creating investor profile'
    });
  }
};

// @desc    Update investor profile
// @route   PUT /api/investors/:id
// @access  Private (Owner only)
exports.updateInvestor = async (req, res, next) => {
  try {
    let investor = await Investor.findById(req.params.id);

    if (!investor) {
      return res.status(404).json({
        success: false,
        error: 'Investor not found'
      });
    }

    // Make sure user is investor owner
    if (investor.userId.toString() !== req.user._id && req.user.role !== 'Admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this investor profile'
      });
    }

    investor = await Investor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: investor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete investor profile
// @route   DELETE /api/investors/:id
// @access  Private (Owner only)
exports.deleteInvestor = async (req, res, next) => {
  try {
    const investor = await Investor.findById(req.params.id);

    if (!investor) {
      return res.status(404).json({
        success: false,
        error: 'Investor not found'
      });
    }

    // Make sure user is investor owner
    if (investor.userId.toString() !== req.user._id && req.user.role !== 'Admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this investor profile'
      });
    }

    // Soft delete
    investor.isActive = false;
    await investor.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get investor by user ID
// @route   GET /api/investors/user/:userId
// @access  Public
exports.getInvestorByUserId = async (req, res, next) => {
  try {
    const investor = await Investor.findOne({ userId: req.params.userId })
      .populate('userId', 'name email profile');

    if (!investor) {
      return res.status(404).json({
        success: false,
        error: 'No investor profile found for this user'
      });
    }

    res.status(200).json({
      success: true,
      data: investor
    });
  } catch (error) {
    next(error);
  }
};

