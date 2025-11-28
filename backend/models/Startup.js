const mongoose = require('mongoose');

const StartupSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  logo: {
    type: String,
    default: ''
  },
  tagline: {
    type: String,
    maxlength: [200, 'Tagline cannot be more than 200 characters'],
    default: ''
  },
  sector: {
    type: String,
    required: [true, 'Please specify a sector'],
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
  },
  stage: {
    type: String,
    required: [true, 'Please specify the stage'],
    enum: ['Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  fundingRequired: {
    min: {
      type: Number,
      required: [true, 'Please specify minimum funding required']
    },
    max: {
      type: Number,
      required: [true, 'Please specify maximum funding required']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  metrics: {
    monthlyRevenue: {
      type: Number,
      default: 0
    },
    users: {
      type: Number,
      default: 0
    },
    growthRate: {
      type: Number,
      default: 0
    },
    mrr: {
      type: Number,
      default: 0
    },
    arr: {
      type: Number,
      default: 0
    }
  },
  documents: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['Pitch Deck', 'Business Plan', 'Financial Projections', 'Other']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  pitchDeckUrl: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  teamSize: {
    type: Number,
    default: 1
  },
  foundedYear: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear()
  },
  location: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
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
StartupSchema.index({ companyName: 'text', description: 'text', tags: 'text' });
StartupSchema.index({ sector: 1, stage: 1 });

module.exports = mongoose.model('Startup', StartupSchema);

