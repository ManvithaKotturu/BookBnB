import React from 'react';
import { useParams } from 'react-router-dom';

const BookDetail = () => {
  const { id } = useParams();

  return (
    <div className="book-detail">
      <h2>Book Details</h2>
      <p>Book ID: {id}</p>
      <p>This is a placeholder for the book detail page.</p>
    </div>
  );
};

export default BookDetail;
