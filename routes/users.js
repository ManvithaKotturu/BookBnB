const express = require('express');
const { query } = require('express-validator');
const User = require('../models/User');
const Book = require('../models/Book');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Search users
// @access  Public
router.get('/', optionalAuth, [
  query('search').optional().trim(),
  query('location').optional().trim(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { search, location, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const filter = {};

    // Search filter
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    // Location filter
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    const users = await User.find(filter)
      .select('username firstName lastName avatar bio location rating totalRatings joinDate')
      .sort({ rating: -1, totalRatings: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: skip + users.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('username firstName lastName avatar bio location rating totalRatings joinDate isVerified');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's books
    const books = await Book.find({ 
      owner: req.params.id,
      isAvailable: true 
    }).select('title author images genre dailyRate rating totalRatings');

    // Get user's stats
    const stats = {
      totalBooks: await Book.countDocuments({ owner: req.params.id }),
      availableBooks: await Book.countDocuments({ owner: req.params.id, isAvailable: true }),
      totalLoans: 0, // This would need to be calculated from Loan model
      averageRating: user.totalRatings > 0 ? (user.rating / user.totalRatings).toFixed(1) : 0
    };

    res.json({
      user,
      books,
      stats
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id/books
// @desc    Get all books by a specific user
// @access  Public
router.get('/:id/books', async (req, res) => {
  try {
    const { available, page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;
    const filter = { owner: req.params.id };

    if (available === 'true') {
      filter.isAvailable = true;
    }

    const books = await Book.find(filter)
      .populate('owner', 'username firstName lastName rating avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Book.countDocuments(filter);

    res.json({
      books,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBooks: total,
        hasNext: skip + books.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get user books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id/reviews
// @desc    Get reviews/ratings for a specific user
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    // This would need to be implemented based on how reviews are stored
    // For now, returning a placeholder
    res.json({
      message: 'Reviews feature coming soon',
      reviews: []
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id/verify
// @desc    Verify a user (admin only)
// @access  Private (admin)
router.put('/:id/verify', auth, async (req, res) => {
  try {
    // This would need admin middleware
    // For now, just checking if the user is trying to verify themselves
    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to verify other users' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
