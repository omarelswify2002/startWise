const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a meeting title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined', 'Tentative'],
      default: 'Pending'
    },
    respondedAt: Date
  }],
  startTime: {
    type: Date,
    required: [true, 'Please specify start time']
  },
  endTime: {
    type: Date,
    required: [true, 'Please specify end time']
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  meetingType: {
    type: String,
    enum: ['Virtual', 'In-Person', 'Phone'],
    default: 'Virtual'
  },
  location: {
    type: String,
    default: ''
  },
  meetingLink: {
    type: String,
    default: ''
  },
  agenda: [{
    item: String,
    duration: Number
  }],
  relatedTo: {
    type: {
      type: String,
      enum: ['Startup', 'Match', 'Deal']
    },
    id: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot be more than 2000 characters']
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
    default: 'Scheduled'
  },
  reminder: {
    enabled: {
      type: Boolean,
      default: true
    },
    minutesBefore: {
      type: Number,
      default: 30
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
MeetingSchema.index({ organizer: 1, startTime: -1 });
MeetingSchema.index({ 'participants.userId': 1, startTime: -1 });
MeetingSchema.index({ status: 1, startTime: 1 });

// Validate end time is after start time
MeetingSchema.pre('save', function(next) {
  if (this.endTime <= this.startTime) {
    next(new Error('End time must be after start time'));
  }
  next();
});

module.exports = mongoose.model('Meeting', MeetingSchema);

