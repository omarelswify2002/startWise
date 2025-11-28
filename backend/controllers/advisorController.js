const Advisor = require('../models/Advisor');

// @desc    Get all advisors
// @route   GET /api/advisors
// @access  Public
exports.getAdvisors = async (req, res, next) => {
  try {
    const { specialization, industry, availability, page = 1, limit = 10 } = req.query;

    // Build query
    let query = { isActive: true };

    if (specialization) query.specializations = specialization;
    if (industry) query.industries = industry;
    if (availability) query.availability = availability;

    // Execute query with pagination
    const advisors = await Advisor.find(query)
      .populate('userId', 'name email profile')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ averageRating: -1, createdAt: -1 });

    const count = await Advisor.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: advisors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single advisor
// @route   GET /api/advisors/:id
// @access  Public
exports.getAdvisor = async (req, res, next) => {
  try {
    const advisor = await Advisor.findById(req.params.id)
      .populate('userId', 'name email profile')
      .populate('reviews.byUser', 'name profile.avatar');

    if (!advisor) {
      return res.status(404).json({
        success: false,
        error: 'Advisor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: advisor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new advisor profile
// @route   POST /api/advisors
// @access  Private (Advisor role)
exports.createAdvisor = async (req, res, next) => {
  try {
    req.body.userId = req.user._id;

    // Check if user already has an advisor profile
    const existingAdvisor = await Advisor.findOne({ userId: req.user._id });
    if (existingAdvisor) {
      return res.status(400).json({
        success: false,
        error: 'You already have an advisor profile. Please update it instead.'
      });
    }

    const advisor = await Advisor.create(req.body);

    res.status(201).json({
      success: true,
      data: advisor
    });
  } catch (error) {
    console.error('Advisor creation error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Server error creating advisor profile'
    });
  }
};

// @desc    Update advisor profile
// @route   PUT /api/advisors/:id
// @access  Private (Owner only)
exports.updateAdvisor = async (req, res, next) => {
  try {
    let advisor = await Advisor.findById(req.params.id);

    if (!advisor) {
      return res.status(404).json({
        success: false,
        error: 'Advisor not found'
      });
    }

    // Make sure user is advisor owner
    if (advisor.userId.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this advisor profile'
      });
    }

    advisor = await Advisor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: advisor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete advisor profile
// @route   DELETE /api/advisors/:id
// @access  Private (Owner only)
exports.deleteAdvisor = async (req, res, next) => {
  try {
    const advisor = await Advisor.findById(req.params.id);

    if (!advisor) {
      return res.status(404).json({
        success: false,
        error: 'Advisor not found'
      });
    }

    // Make sure user is advisor owner
    if (advisor.userId.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this advisor profile'
      });
    }

    // Soft delete
    advisor.isActive = false;
    await advisor.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review to advisor
// @route   POST /api/advisors/:id/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const advisor = await Advisor.findById(req.params.id);

    if (!advisor) {
      return res.status(404).json({
        success: false,
        error: 'Advisor not found'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = advisor.reviews.find(
      r => r.byUser.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this advisor'
      });
    }

    const review = {
      byUser: req.user.id,
      rating,
      comment
    };

    advisor.reviews.push(review);
    await advisor.save();

    res.status(201).json({
      success: true,
      data: advisor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get advisor by user ID
// @route   GET /api/advisors/user/:userId
// @access  Public
exports.getAdvisorByUserId = async (req, res, next) => {
  try {
    const advisor = await Advisor.findOne({ userId: req.params.userId })
      .populate('userId', 'name email profile')
      .populate('reviews.byUser', 'name profile.avatar');

    if (!advisor) {
      return res.status(404).json({
        success: false,
        error: 'No advisor profile found for this user'
      });
    }

    res.status(200).json({
      success: true,
      data: advisor
    });
  } catch (error) {
    next(error);
  }
};

