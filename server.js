const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config({ path: './config.env' });

// 👉 Import Models
const User = require('./models/User');
const Book = require('./models/Book');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Seed Function ---
const seedBooksIfEmpty = async () => {
  try {
    const bookCount = await Book.countDocuments();
    if (bookCount > 0) {
      console.log('📚 Books already exist in DB, skipping seed.');
      return;
    }

    // Create demo user if not exists
    let user = await User.findOne({ email: 'demo@demo.com' });
    if (!user) {
      user = new User({
        username: 'demoUser',
        email: 'demo@demo.com',
        password: 'password123', // ⚠️ should be hashed in production
        firstName: 'Demo',
        lastName: 'User'
      });
      await user.save();
      console.log('👤 Demo user created');
    }

    // Sample books
    const sampleBooks = [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'Classic novel set in the Jazz Age.',
        genre: 'Fiction',
        dailyRate: 2,
        weeklyRate: 10,
        monthlyRate: 30,
        location: 'New York',
        owner: user._id,
        images: ['https://covers.openlibrary.org/b/id/7222246-L.jpg']
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        description: 'Pulitzer Prize–winning novel about racial injustice.',
        genre: 'Classic',
        dailyRate: 1.5,
        weeklyRate: 8,
        monthlyRate: 25,
        location: 'Alabama',
        owner: user._id,
        images: ['https://covers.openlibrary.org/b/id/8225265-L.jpg']
      },
      {
        title: '1984',
        author: 'George Orwell',
        description: 'Dystopian novel exploring surveillance and control.',
        genre: 'Science Fiction',
        dailyRate: 2,
        weeklyRate: 9,
        monthlyRate: 28,
        location: 'London',
        owner: user._id,
        images: ['https://covers.openlibrary.org/b/id/7222246-L.jpg']
      }
    ];

    await Book.insertMany(sampleBooks);
    console.log('✅ Sample books seeded');
  } catch (error) {
    console.error('❌ Error seeding books:', error.message);
  }
};

// Database connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Atlas connected');
    } else {
      await mongoose.connect('mongodb://localhost:27017/bookbnb');
      console.log('Local MongoDB connected');
    }

    // 👉 Run seeding after DB connects
    await seedBooksIfEmpty();
  } catch (err) {
    console.log('MongoDB connection error:', err.message);
    console.log('Please check your MongoDB connection or update config.env');
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/loans', require('./routes/loans'));
app.use('/api/users', require('./routes/users'));

// 👉 Serve Vite static assets if in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
