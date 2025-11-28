const Meeting = require('../models/Meeting');
const { sendEmail } = require('../utils/sendEmail');

// @desc    Create a meeting
// @route   POST /api/meetings
// @access  Private
exports.createMeeting = async (req, res, next) => {
  try {
    req.body.organizer = req.user._id;

    const meeting = await Meeting.create(req.body);

    // Populate organizer and participants
    await meeting.populate('organizer', 'name email profile');
    await meeting.populate('participants.userId', 'name email profile');

    // Send email notifications to participants
    for (const participant of meeting.participants) {
      try {
        await sendEmail({
          email: participant.userId.email,
          subject: `Meeting Invitation: ${meeting.title}`,
          html: `
            <h2>You've been invited to a meeting</h2>
            <p><strong>Title:</strong> ${meeting.title}</p>
            <p><strong>Organizer:</strong> ${meeting.organizer.name}</p>
            <p><strong>Date:</strong> ${new Date(meeting.startTime).toLocaleString()}</p>
            <p><strong>Duration:</strong> ${Math.round((new Date(meeting.endTime) - new Date(meeting.startTime)) / 60000)} minutes</p>
            ${meeting.description ? `<p><strong>Description:</strong> ${meeting.description}</p>` : ''}
            ${meeting.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meeting.meetingLink}">${meeting.meetingLink}</a></p>` : ''}
            <p>Please respond to this invitation.</p>
          `
        });
      } catch (emailError) {
        console.error('Error sending meeting invitation:', emailError);
      }
    }

    res.status(201).json({
      success: true,
      data: meeting
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all meetings for current user
// @route   GET /api/meetings
// @access  Private
exports.getMeetings = async (req, res, next) => {
  try {
    const { status, upcoming, page = 1, limit = 10 } = req.query;

    // Build query
    let query = {
      $or: [
        { organizer: req.user._id },
        { 'participants.userId': req.user._id }
      ]
    };

    if (status) query.status = status;
    if (upcoming === 'true') {
      query.startTime = { $gte: new Date() };
    }

    const meetings = await Meeting.find(query)
      .populate('organizer', 'name email profile')
      .populate('participants.userId', 'name email profile')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ startTime: 1 });

    const count = await Meeting.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: meetings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending meetings count
// @route   GET /api/meetings/pending/count
// @access  Private
exports.getPendingMeetingsCount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Count meetings where user is a participant with Pending status
    const count = await Meeting.countDocuments({
      'participants': {
        $elemMatch: {
          userId: userId,
          status: 'Pending'
        }
      },
      status: 'Scheduled',
      startTime: { $gte: new Date() } // Only upcoming meetings
    });

    res.status(200).json({
      success: true,
      data: count
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single meeting
// @route   GET /api/meetings/:id
// @access  Private
exports.getMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('organizer', 'name email profile')
      .populate('participants.userId', 'name email profile');

    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found'
      });
    }

    // Check if user is organizer or participant
    const isOrganizer = meeting.organizer._id.toString() === req.user._id.toString();
    const isParticipant = meeting.participants.some(
      p => p.userId._id.toString() === req.user._id.toString()
    );

    if (!isOrganizer && !isParticipant && req.user.role !== 'Admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to view this meeting'
      });
    }

    res.status(200).json({
      success: true,
      data: meeting
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update meeting
// @route   PUT /api/meetings/:id
// @access  Private (Organizer only)
exports.updateMeeting = async (req, res, next) => {
  try {
    let meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found'
      });
    }

    // Check if user is organizer
    if (meeting.organizer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this meeting'
      });
    }

    meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('organizer', 'name email profile')
      .populate('participants.userId', 'name email profile');

    res.status(200).json({
      success: true,
      data: meeting
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to meeting invitation
// @route   PUT /api/meetings/:id/respond
// @access  Private
exports.respondToMeeting = async (req, res, next) => {
  try {
    const { status } = req.body; // Accepted, Declined, Tentative

    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found'
      });
    }

    // Find participant
    const participant = meeting.participants.find(
      p => p.userId.toString() === req.user._id.toString()
    );

    if (!participant) {
      return res.status(400).json({
        success: false,
        error: 'You are not invited to this meeting'
      });
    }

    // Update participant status
    participant.status = status;
    participant.respondedAt = Date.now();

    await meeting.save();

    res.status(200).json({
      success: true,
      data: meeting
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel meeting
// @route   DELETE /api/meetings/:id
// @access  Private (Organizer only)
exports.cancelMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found'
      });
    }

    // Check if user is organizer
    if (meeting.organizer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to cancel this meeting'
      });
    }

    meeting.status = 'Cancelled';
    await meeting.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};



