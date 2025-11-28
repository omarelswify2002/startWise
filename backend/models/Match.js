const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Startup',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'candidateModel'
  },
  candidateModel: {
    type: String,
    required: true,
    enum: ['Investor', 'Advisor']
  },
  type: {
    type: String,
    required: true,
    enum: ['Investor', 'Advisor']
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  matchFactors: {
    sectorMatch: {
      type: Number,
      default: 0
    },
    stageMatch: {
      type: Number,
      default: 0
    },
    fundingMatch: {
      type: Number,
      default: 0
    },
    locationMatch: {
      type: Number,
      default: 0
    },
    experienceMatch: {
      type: Number,
      default: 0
    },
    semanticMatch: {
      type: Number,
      default: 0
    }
  },
  reason: {
    type: String,
    required: true,
    maxlength: [500, 'Reason cannot be more than 500 characters']
  },
  highlights: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Recommended', 'Viewed', 'Contacted', 'In Discussion', 'Accepted', 'Rejected', 'Closed'],
    default: 'Recommended'
  },
  viewedAt: {
    type: Date
  },
  contactedAt: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
MatchSchema.index({ startupId: 1, score: -1 });
MatchSchema.index({ candidateId: 1, score: -1 });
MatchSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Match', MatchSchema);

