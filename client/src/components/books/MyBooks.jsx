import React from 'react';

const MyBooks = () => {
  const demoBooks = [
    { id: 1, title: 'My First Book', status: 'Available' },
    { id: 2, title: 'My Second Book', status: 'Rented Out' },
    { id: 3, title: 'My Third Book', status: 'Reserved' }
  ];

  return (
    <div className="my-books">
      <h2>My Books</h2>
      <ul>
        {demoBooks.map(book => (
          <li key={book.id}>
            <strong>{book.title}</strong> - {book.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyBooks;
