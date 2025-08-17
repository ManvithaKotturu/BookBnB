import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import BookList from './components/books/BookList';
import BookDetail from './components/books/BookDetail';
import AddBook from './components/books/AddBook';
import EditBook from './components/books/EditBook';
import Profile from './components/profile/Profile';
import MyBooks from './components/books/MyBooks';
import MyLoans from './components/loans/MyLoans';
import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Demo: load some fake data on mount
  useEffect(() => {
    setTimeout(() => {
      setBooks([
        {
          _id: "1",
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          genre: "Classic",
          dailyRate: 2.5,
          location: "New York",
          isAvailable: true,
          images: [],
          owner: { _id: "u1", firstName: "John", lastName: "Doe" },
          averageRating: 4.5,
          totalRatings: 12
        },
        {
          _id: "2",
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          genre: "Fiction",
          dailyRate: 3.0,
          location: "Alabama",
          isAvailable: false,
          images: [],
          owner: { _id: "u2", firstName: "Jane", lastName: "Smith" },
          averageRating: 5.0,
          totalRatings: 8
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // add a new book
  const handleAddBook = (newBook) => {
    setBooks((prev) => [
      ...prev,
      { _id: Date.now().toString(), ...newBook }
    ]);
  };

  // edit existing book
  const handleEditBook = (id, updatedBook) => {
    setBooks((prev) =>
      prev.map((book) =>
        book._id === id ? { ...book, ...updatedBook } : book
      )
    );
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/books" element={<BookList books={books} loading={loading} />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route 
                path="/add-book" 
                element={
                  <PrivateRoute>
                    <AddBook onAddBook={handleAddBook} />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/edit-book/:id" 
                element={
                  <PrivateRoute>
                    <EditBook books={books} onEditBook={handleEditBook} />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/my-books" 
                element={
                  <PrivateRoute>
                    <MyBooks />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/my-loans" 
                element={
                  <PrivateRoute>
                    <MyLoans />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
