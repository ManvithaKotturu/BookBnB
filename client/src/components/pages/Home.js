import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaBook, FaUsers, FaStar } from 'react-icons/fa';
import axios from 'axios';
import BookCard from '../books/BookCard';
import './Home.css';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    search: '',
    genre: '',
    location: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    loadFeaturedBooks();
  }, []);

  const loadFeaturedBooks = async () => {
    try {
      const res = await axios.get('/api/books?limit=6&page=1');
      setFeaturedBooks(res.data.books);
    } catch (error) {
      console.error('Error loading featured books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key]) {
        params.append(key, searchParams[key]);
      }
    });
    window.location.href = `/books?${params.toString()}`;
  };

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Business',
    'Technology', 'Cooking', 'Travel', 'Poetry', 'Children'
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Share Your Books, Connect with Readers</h1>
          <p>
            Join the community of book lovers who share, discover, and connect through 
            the joy of reading. Lend your books and borrow from others - just like Airbnb for books!
          </p>
          <div className="hero-buttons">
            <Link to="/books" className="btn btn-primary btn-lg">
              <FaBook />
              Browse Books
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              <FaUsers />
              Join Now
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <h2>Find Your Next Read</h2>
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label htmlFor="search" className="form-label">Search</label>
            <input
              type="text"
              id="search"
              name="search"
              className="form-input"
              placeholder="Search by title, author, or description..."
              value={searchParams.search}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="genre" className="form-label">Genre</label>
            <select
              id="genre"
              name="genre"
              className="form-input form-select"
              value={searchParams.genre}
              onChange={handleSearchChange}
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="location" className="form-label">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              className="form-input"
              placeholder="City, State, or ZIP"
              value={searchParams.location}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="minPrice" className="form-label">Min Price</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              className="form-input"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={searchParams.minPrice}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="maxPrice" className="form-label">Max Price</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              className="form-input"
              placeholder="100.00"
              min="0"
              step="0.01"
              value={searchParams.maxPrice}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="form-group">
            <button type="submit" className="btn btn-primary btn-lg">
              <FaSearch />
              Search
            </button>
          </div>
        </form>
      </section>

      {/* Featured Books Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Books</h2>
          <Link to="/books" className="btn btn-secondary">
            View All Books
          </Link>
        </div>
        
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="book-grid">
            {featuredBooks.map(book => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
        
        {!loading && featuredBooks.length === 0 && (
          <div className="empty-state">
            <FaBook className="empty-state-icon" />
            <h3>No books available yet</h3>
            <p>Be the first to add a book to our platform!</p>
            <Link to="/add-book" className="btn btn-primary">
              Add Your First Book
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose BookBnB?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaBook />
            </div>
            <h3>Share Your Library</h3>
            <p>Earn money by lending your books to other readers in your community.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaUsers />
            </div>
            <h3>Connect with Readers</h3>
            <p>Meet fellow book lovers and build meaningful connections through shared reading experiences.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaStar />
            </div>
            <h3>Trusted Community</h3>
            <p>Our rating and review system ensures a safe and reliable lending experience for everyone.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Sharing?</h2>
          <p>Join thousands of readers who are already sharing their love of books.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link to="/books" className="btn btn-secondary btn-lg">
              Explore Books
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;


