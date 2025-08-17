const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Book = require('../models/Book');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/books
// @desc    Get all books with filters
// @access  Public
router.get('/', optionalAuth, [
  query('search').optional().trim(),
  query('genre').optional().trim(),
  query('location').optional().trim(),
  query('minPrice').optional().isNumeric(),
  query('maxPrice').optional().isNumeric(),
  query('condition').optional().isIn(['New', 'Like New', 'Very Good', 'Good', 'Fair', 'Poor']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      search,
      genre,
      location,
      minPrice,
      maxPrice,
      condition,
      page = 1,
      limit = 12
    } = req.query;

    const skip = (page - 1) * limit;
    const filter = { isAvailable: true };

    // Search filter
    if (search) {
      filter.$text = { $search: search };
    }

    // Genre filter
    if (genre) {
      filter.genre = { $regex: genre, $options: 'i' };
    }

    // Location filter
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.dailyRate = {};
      if (minPrice) filter.dailyRate.$gte = parseFloat(minPrice);
      if (maxPrice) filter.dailyRate.$lte = parseFloat(maxPrice);
    }

    // Condition filter
    if (condition) {
      filter.condition = condition;
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
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/books/:id
// @desc    Get book by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('owner', 'username firstName lastName rating avatar bio location joinDate');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    console.error('Get book error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/books
// @desc    Create a new book
// @access  Private
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('genre').notEmpty().withMessage('Genre is required'),
  body('dailyRate').isNumeric().withMessage('Daily rate must be a number'),
  body('location').notEmpty().withMessage('Location is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      author,
      isbn,
      description,
      genre,
      condition,
      language,
      pages,
      publishedYear,
      images,
      dailyRate,
      weeklyRate,
      monthlyRate,
      location,
      coordinates,
      tags,
      deposit,
      rules
    } = req.body;

    const book = new Book({
      title,
      author,
      isbn,
      description,
      genre,
      condition: condition || 'Good',
      language: language || 'English',
      pages,
      publishedYear,
      images: images || [],
      owner: req.user._id,
      dailyRate,
      weeklyRate,
      monthlyRate,
      location,
      coordinates,
      tags: tags || [],
      deposit: deposit || 0,
      rules: rules || []
    });

    await book.save();

    const populatedBook = await Book.findById(book._id)
      .populate('owner', 'username firstName lastName rating avatar');

    res.status(201).json(populatedBook);
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/books/:id
// @desc    Update a book
// @access  Private (owner only)
router.put('/:id', auth, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('author').optional().notEmpty().withMessage('Author cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('dailyRate').optional().isNumeric().withMessage('Daily rate must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check ownership
    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('owner', 'username firstName lastName rating avatar');

    res.json(updatedBook);
  } catch (error) {
    console.error('Update book error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete a book
// @access  Private (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check ownership
    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/books/user/:userId
// @desc    Get books by user ID
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const books = await Book.find({ 
      owner: req.params.userId,
      isAvailable: true 
    }).populate('owner', 'username firstName lastName rating avatar');

    res.json(books);
  } catch (error) {
    console.error('Get user books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/books/:id/availability
// @desc    Update book availability
// @access  Private (owner only)
router.put('/:id/availability', auth, async (req, res) => {
  try {
    const { isAvailable } = req.body;
    
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }

    book.isAvailable = isAvailable;
    await book.save();

    res.json(book);
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
