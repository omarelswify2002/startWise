const mongoose = require('mongoose');

const InvestorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  investorName: {
    type: String,
    required: [true, 'Please add investor name'],
    trim: true
  },
  fundName: {
    type: String,
    trim: true,
    default: ''
  },
  investorType: {
    type: String,
    enum: ['Angel Investor', 'Venture Capital', 'Private Equity', 'Corporate VC', 'Family Office', 'Accelerator', 'Other'],
    required: [true, 'Please specify investor type']
  },
  sectors: [{
    type: String,
    enum: [
      'Fintech',
      'Edtech',
      'Healthtech',
      'E-commerce',
      'SaaS',
      'AI/ML',
      'Blockchain',
      'IoT',
      'Cleantech',
      'Agritech',
      'Foodtech',
      'Proptech',
      'Logistics',
      'Entertainment',
      'Other'
    ]
  }],
  investmentRange: {
    min: {
      type: Number,
      required: [true, 'Please specify minimum investment amount']
    },
    max: {
      type: Number,
      required: [true, 'Please specify maximum investment amount']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  preferredStages: [{
    type: String,
    enum: ['Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth']
  }],
  location: {
    type: String,
    default: ''
  },
  geographicFocus: [{
    type: String
  }],
  previousInvestments: [{
    companyName: String,
    sector: String,
    stage: String,
    year: Number,
    amount: Number
  }],
  portfolio: [{
    companyName: String,
    description: String,
    website: String,
    logo: String
  }],
  preferences: {
    lookingFor: {
      type: String,
      maxlength: [1000, 'Looking for cannot be more than 1000 characters']
    },
    dealSize: String,
    investmentHorizon: String,
    exitStrategy: String
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  website: {
    type: String,
    default: ''
  },
  socialLinks: {
    linkedin: String,
    twitter: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  totalInvestments: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search optimization
InvestorSchema.index({ investorName: 'text', bio: 'text' });
// InvestorSchema.index({ sectors: 1, preferredStages: 1 });

module.exports = mongoose.model('Investor', InvestorSchema);

