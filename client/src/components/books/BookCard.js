import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaBook } from 'react-icons/fa';
import './BookCard.css';

const BookCard = ({ book }) => {
  const formatPrice = (price) => {
    if (!price) return "Free";
    return `$${parseFloat(price).toFixed(2)}/day`;
  };

  const getBookImage = () => {
    if (book.images && book.images.length > 0) {
      return book.images[0];
    }
    return null;
  };

  const renderRating = () => {
    if (!book.totalRatings || book.totalRatings === 0) {
      return <span className="no-rating">No ratings yet</span>;
    }

    const rating = book.averageRating || 
                   (book.rating && book.totalRatings 
                     ? (book.rating / book.totalRatings).toFixed(1) 
                     : "0.0");
    
    return (
      <div className="book-rating">
        <FaStar className="rating-star" />
        <span>{rating}</span>
        <span className="rating-count">({book.totalRatings})</span>
      </div>
    );
  };

  return (
    <div className="book-card">
      <div className="book-image-container">
        {getBookImage() ? (
          <img 
            src={getBookImage()} 
            alt={`${book.title || "Book"} cover`} 
            className="book-image"
          />
        ) : (
          <div className="book-image-placeholder">
            <FaBook />
          </div>
        )}
        {book.isAvailable === false && (
          <div className="book-unavailable">
            <span>Currently Unavailable</span>
          </div>
        )}
      </div>
      
      <div className="book-info">
        <Link to={`/books/${book._id || "#"}`} className="book-title">
          {book.title || "Untitled Book"}
        </Link>
        
        <div className="book-author">
          by {book.author || "Unknown"}
        </div>
        
        <div className="book-genre">
          <span className="badge badge-primary">{book.genre || "General"}</span>
        </div>
        
        <div className="book-meta">
          <div className="book-price">
            {formatPrice(book.dailyRate)}
          </div>
          {renderRating()}
        </div>
        
        <div className="book-location">
          <FaMapMarkerAlt className="location-icon" />
          <span>{book.location || "Unknown"}</span>
        </div>
        
        <div className="book-owner">
          <span>Owner: </span>
          <Link to={`/users/${book.owner?._id || "#"}`} className="owner-link">
            {book.owner?.firstName || "Anonymous"} {book.owner?.lastName || ""}
          </Link>
        </div>
        
        <div className="book-actions">
          <Link to={`/books/${book._id || "#"}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
