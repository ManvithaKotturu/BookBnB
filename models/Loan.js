const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'active', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  deposit: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'transfer'],
    default: 'cash'
  },
  notes: {
    type: String,
    maxlength: 500
  },
  borrowerRating: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 500
    },
    date: Date
  },
  lenderRating: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 500
    },
    date: Date
  },
  pickupLocation: {
    type: String,
    required: true
  },
  returnLocation: {
    type: String,
    required: true
  },
  lateFees: {
    type: Number,
    default: 0,
    min: 0
  },
  damageReport: {
    reported: {
      type: Boolean,
      default: false
    },
    description: String,
    date: Date,
    resolved: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Virtual for loan duration in days
loanSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Virtual for checking if loan is overdue
loanSchema.virtual('isOverdue').get(function() {
  if (this.status === 'active' && this.endDate && new Date() > this.endDate) {
    return true;
  }
  return false;
});

// Ensure virtual fields are serialized
loanSchema.set('toJSON', { virtuals: true });
loanSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Loan', loanSchema);
