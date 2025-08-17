const express = require('express');
const { body, validationResult } = require('express-validator');
const Loan = require('../models/Loan');
const Book = require('../models/Book');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/loans
// @desc    Create a new loan request
// @access  Private
router.post('/', auth, [
  body('bookId').notEmpty().withMessage('Book ID is required'),
  body('startDate').isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').isISO8601().withMessage('End date must be a valid date'),
  body('pickupLocation').notEmpty().withMessage('Pickup location is required'),
  body('returnLocation').notEmpty().withMessage('Return location is required'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      bookId,
      startDate,
      endDate,
      pickupLocation,
      returnLocation,
      notes
    } = req.body;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!book.isAvailable) {
      return res.status(400).json({ message: 'Book is not available for lending' });
    }

    // Check if user is not trying to borrow their own book
    if (book.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot borrow your own book' });
    }

    // Check if dates are valid
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      return res.status(400).json({ message: 'Start date cannot be in the past' });
    }

    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Calculate loan duration and total amount
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    let totalAmount = 0;

    if (duration <= 7 && book.weeklyRate) {
      totalAmount = book.weeklyRate;
    } else if (duration <= 30 && book.monthlyRate) {
      totalAmount = book.monthlyRate;
    } else {
      totalAmount = book.dailyRate * duration;
    }

    // Create loan
    const loan = new Loan({
      book: bookId,
      borrower: req.user._id,
      lender: book.owner,
      startDate: start,
      endDate: end,
      totalAmount,
      deposit: book.deposit,
      pickupLocation,
      returnLocation,
      notes: notes || ''
    });

    await loan.save();

    // Populate loan with book and user details
    const populatedLoan = await Loan.findById(loan._id)
      .populate('book')
      .populate('borrower', 'username firstName lastName')
      .populate('lender', 'username firstName lastName');

    res.status(201).json(populatedLoan);
  } catch (error) {
    console.error('Create loan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/loans
// @desc    Get user's loans (as borrower or lender)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, role } = req.query;
    const filter = {};

    if (role === 'borrower') {
      filter.borrower = req.user._id;
    } else if (role === 'lender') {
      filter.lender = req.user._id;
    } else {
      filter.$or = [
        { borrower: req.user._id },
        { lender: req.user._id }
      ];
    }

    if (status) {
      filter.status = status;
    }

    const loans = await Loan.find(filter)
      .populate('book', 'title author images')
      .populate('borrower', 'username firstName lastName avatar')
      .populate('lender', 'username firstName lastName avatar')
      .sort({ createdAt: -1 });

    res.json(loans);
  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/loans/:id
// @desc    Get loan by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('book')
      .populate('borrower', 'username firstName lastName avatar email')
      .populate('lender', 'username firstName lastName avatar email');

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Check if user is involved in this loan
    if (loan.borrower._id.toString() !== req.user._id.toString() && 
        loan.lender._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this loan' });
    }

    res.json(loan);
  } catch (error) {
    console.error('Get loan error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Loan not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/loans/:id/status
// @desc    Update loan status (approve, reject, complete, etc.)
// @access  Private (lender only for approve/reject, both for complete)
router.put('/:id/status', auth, [
  body('status').isIn(['approved', 'rejected', 'active', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, notes } = req.body;
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Check authorization based on status change
    if (['approved', 'rejected'].includes(status)) {
      if (loan.lender.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only the lender can approve or reject loans' });
      }
    } else if (['active', 'completed'].includes(status)) {
      if (loan.borrower.toString() !== req.user._id.toString() && 
          loan.lender.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this loan' });
      }
    }

    // Update loan status
    loan.status = status;
    if (notes) loan.notes = notes;

    // If loan is approved, make book unavailable
    if (status === 'approved') {
      await Book.findByIdAndUpdate(loan.book, { isAvailable: false });
    }

    // If loan is completed or cancelled, make book available again
    if (['completed', 'cancelled'].includes(status)) {
      await Book.findByIdAndUpdate(loan.book, { isAvailable: true });
    }

    await loan.save();

    const updatedLoan = await Loan.findById(loan._id)
      .populate('book')
      .populate('borrower', 'username firstName lastName avatar')
      .populate('lender', 'username firstName lastName avatar');

    res.json(updatedLoan);
  } catch (error) {
    console.error('Update loan status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/loans/:id/rate
// @desc    Rate the other party in a loan
// @access  Private
router.post('/:id/rate', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Check if user is involved in this loan
    if (loan.borrower.toString() !== req.user._id.toString() && 
        loan.lender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to rate this loan' });
    }

    // Check if loan is completed
    if (loan.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed loans' });
    }

    // Determine which rating to update
    if (loan.borrower.toString() === req.user._id.toString()) {
      // Borrower rating the lender
      if (loan.borrowerRating.rating) {
        return res.status(400).json({ message: 'You have already rated this loan' });
      }
      loan.borrowerRating = { rating, comment, date: new Date() };
    } else {
      // Lender rating the borrower
      if (loan.lenderRating.rating) {
        return res.status(400).json({ message: 'You have already rated this loan' });
      }
      loan.lenderRating = { rating, comment, date: new Date() };
    }

    await loan.save();

    // Update user ratings
    const targetUserId = loan.borrower.toString() === req.user._id.toString() 
      ? loan.lender 
      : loan.borrower;

    const targetUser = await User.findById(targetUserId);
    if (targetUser) {
      const newTotalRating = targetUser.rating * targetUser.totalRatings + rating;
      targetUser.totalRatings += 1;
      targetUser.rating = newTotalRating / targetUser.totalRatings;
      await targetUser.save();
    }

    res.json(loan);
  } catch (error) {
    console.error('Rate loan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
