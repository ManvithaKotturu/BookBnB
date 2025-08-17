import React from 'react';
import { useParams } from 'react-router-dom';

const EditBook = () => {
  const { id } = useParams();

  const demoBook = {
    title: 'Demo Book Title',
    author: 'Demo Author',
    description: 'This is a demo description of the book.',
    genre: 'Fiction',
    pages: 250
  };

  return (
    <div className="edit-book">
      <h2>Edit Book</h2>
      <p><strong>Book ID:</strong> {id}</p>
      <form>
        <label>Title:</label>
        <input type="text" value={demoBook.title} readOnly />

        <label>Author:</label>
        <input type="text" value={demoBook.author} readOnly />

        <label>Description:</label>
        <textarea value={demoBook.description} readOnly />

        <label>Genre:</label>
        <input type="text" value={demoBook.genre} readOnly />

        <label>Pages:</label>
        <input type="number" value={demoBook.pages} readOnly />

        <button disabled>Save (Demo Only)</button>
      </form>
    </div>
  );
};

export default EditBook;
