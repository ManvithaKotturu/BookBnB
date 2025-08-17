import React from 'react';
import BookCard from './BookCard';
import './BookList.css';


const BookList = ({ books = [], loading }) => {
  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  const demoBooks = [
    {
      _id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Classic",
      images: ["https://covers.openlibrary.org/b/id/7222246-L.jpg"],
      dailyRate: 2.5,
      averageRating: 4.5,   // ✅ added
      totalRatings: 12,     // ✅ keep
      location: "New York",
      owner: { _id: "u1", firstName: "Alice", lastName: "Johnson" },
      isAvailable: true
    },
    {
      _id: "2",
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian",
      images: ["https://covers.openlibrary.org/b/id/7222246-L.jpg"],
      dailyRate: 3.0,
      averageRating: 4.0,   // ✅ added
      totalRatings: 8,      // ✅ keep
      location: "London",
      owner: { _id: "u2", firstName: "Bob", lastName: "Smith" },
      isAvailable: false
    }
  ];
  
  

  const list = books.length > 0 ? books : demoBooks;

  return (
    <div className="book-grid">
      {list.map(book => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
};

export default BookList;
