const mongoose = require('mongoose');

const AdvisorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  advisorName: {
    type: String,
    required: [true, 'Please add advisor name'],
    trim: true
  },
  title: {
    type: String,
    default: ''
  },
  specializations: [{
    type: String,
    enum: [
      'Growth Strategy',
      'Finance & Fundraising',
      'Marketing & Sales',
      'Product Development',
      'Technology & Engineering',
      'Operations',
      'Legal & Compliance',
      'HR & Talent',
      'Business Development',
      'International Expansion',
      'Other'
    ]
  }],
  expertise: [{
    area: String,
    yearsOfExperience: Number,
    description: String
  }],
  industries: [{
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
  yearsOfExperience: {
    type: Number,
    required: [true, 'Please specify years of experience'],
    min: 0
  },
  hourlyRate: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  availability: {
    type: String,
    enum: ['Available', 'Limited', 'Not Available'],
    default: 'Available'
  },
  availableHoursPerWeek: {
    type: Number,
    default: 0
  },
  bio: {
    type: String,
    required: [true, 'Please add a bio'],
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  certifications: [{
    name: String,
    issuer: String,
    year: Number
  }],
  previousRoles: [{
    title: String,
    company: String,
    duration: String,
    description: String
  }],
  companiesAdvised: [{
    companyName: String,
    sector: String,
    duration: String,
    outcome: String
  }],
  reviews: [{
    byUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    default: ''
  },
  languages: [{
    type: String
  }],
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
  totalSessions: {
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

// Calculate average rating before saving
AdvisorSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
    this.totalReviews = this.reviews.length;
  }
  next();
});

// Index for search optimization
AdvisorSchema.index({ advisorName: 'text', bio: 'text' });
// Separate indexes for array fields (cannot index parallel arrays)
AdvisorSchema.index({ specializations: 1 });
AdvisorSchema.index({ industries: 1 });

module.exports = mongoose.model('Advisor', AdvisorSchema);

