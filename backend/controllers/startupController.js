const Startup = require('../models/Startup');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @desc    Get all startups
// @route   GET /api/startups
// @access  Public
exports.getStartups = async (req, res, next) => {
  try {
    const { sector, stage, search, page = 1, limit = 10 } = req.query;

    // Build query
    let query = { isActive: true };

    if (sector) query.sector = sector;
    if (stage) query.stage = stage;
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const startups = await Startup.find(query)
      .populate('userId', 'name email profile')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Startup.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: startups
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single startup
// @route   GET /api/startups/:id
// @access  Public
exports.getStartup = async (req, res, next) => {
  try {
    const startup = await Startup.findById(req.params.id)
      .populate('userId', 'name email profile');

    if (!startup) {
      return res.status(404).json({
        success: false,
        error: 'Startup not found'
      });
    }

    // Increment views
    startup.views += 1;
    await startup.save();

    res.status(200).json({
      success: true,
      data: startup
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new startup
// @route   POST /api/startups
// @access  Private (Startup role)
exports.createStartup = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.userId = req.user._id;

    // Check if user already has a startup
    const existingStartup = await Startup.findOne({ userId: req.user._id });
    if (existingStartup) {
      return res.status(400).json({
        success: false,
        error: 'You already have a startup profile. Please update it instead.'
      });
    }

    const startup = await Startup.create(req.body);

    res.status(201).json({
      success: true,
      data: startup
    });
  } catch (error) {
    console.error('Startup creation error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Server error creating startup profile'
    });
  }
};

// @desc    Update startup
// @route   PUT /api/startups/:id
// @access  Private (Owner only)
exports.updateStartup = async (req, res, next) => {
  try {
    let startup = await Startup.findById(req.params.id);

    if (!startup) {
      return res.status(404).json({
        success: false,
        error: 'Startup not found'
      });
    }

    // Make sure user is startup owner
    if (startup.userId.toString() !== req.user._id && req.user.role !== 'Admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this startup'
      });
    }

    startup = await Startup.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: startup
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete startup
// @route   DELETE /api/startups/:id
// @access  Private (Owner only)
exports.deleteStartup = async (req, res, next) => {
  try {
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
      return res.status(404).json({
        success: false,
        error: 'Startup not found'
      });
    }

    // Make sure user is startup owner
    if (startup.userId.toString() !== req.user._id && req.user.role !== 'Admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this startup'
      });
    }

    // Soft delete
    startup.isActive = false;
    await startup.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload startup documents
// @route   POST /api/startups/:id/upload
// @access  Private (Owner only)
exports.uploadDocuments = async (req, res, next) => {
  try {
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
      return res.status(404).json({
        success: false,
        error: 'Startup not found'
      });
    }

    // Make sure user is startup owner
    if (startup.userId.toString() !== req.user._id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to upload documents for this startup'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please upload at least one file'
      });
    }

    const uploadedDocs = [];

    // Upload files to Cloudinary
    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'startups/documents',
            resource_type: 'auto'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });

      uploadedDocs.push({
        name: file.originalname,
        url: result.secure_url,
        type: req.body.type || 'Other'
      });
    }

    // Add documents to startup
    startup.documents.push(...uploadedDocs);
    await startup.save();

    res.status(200).json({
      success: true,
      data: uploadedDocs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get startup by user ID
// @route   GET /api/startups/user/:userId
// @access  Public
exports.getStartupByUserId = async (req, res, next) => {
  try {
    const startup = await Startup.findOne({ userId: req.params.userId })
      .populate('userId', 'name email profile');

    if (!startup) {
      return res.status(404).json({
        success: false,
        error: 'No startup found for this user'
      });
    }

    res.status(200).json({
      success: true,
      data: startup
    });
  } catch (error) {
    next(error);
  }
};

exports.upload = upload;

