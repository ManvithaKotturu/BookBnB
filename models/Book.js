const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  genre: {
    type: String,
    required: true,
    trim: true
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Very Good', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  },
  language: {
    type: String,
    default: 'English'
  },
  pages: {
    type: Number,
    min: 1
  },
  publishedYear: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear()
  },
  images: [{
    type: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  dailyRate: {
    type: Number,
    required: true,
    min: 0.01
  },
  weeklyRate: {
    type: Number,
    min: 0.01
  },
  monthlyRate: {
    type: Number,
    min: 0.01
  },
  location: {
    type: String,
    required: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  tags: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  totalLoans: {
    type: Number,
    default: 0
  },
  deposit: {
    type: Number,
    default: 0,
    min: 0
  },
  rules: [{
    type: String,
    maxlength: 200
  }],
  availability: {
    startDate: Date,
    endDate: Date,
    blackoutDates: [Date]
  }
}, {
  timestamps: true
});

// Index for search functionality
bookSchema.index({ title: 'text', author: 'text', description: 'text', genre: 'text' });

// Virtual for average rating
bookSchema.virtual('averageRating').get(function() {
  return this.totalRatings > 0 ? (this.rating / this.totalRatings).toFixed(1) : 0;
});

// Ensure virtual fields are serialized
bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Book', bookSchema);
