import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaBook, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <FaBook className="brand-icon" />
          <span>BookBnB</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/books" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Browse Books
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/add-book" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Add Book
              </Link>
              <Link to="/my-books" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                My Books
              </Link>
              <Link to="/my-loans" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                My Loans
              </Link>
              <div className="nav-dropdown">
                <button className="nav-dropdown-toggle">
                  <FaUser className="user-icon" />
                  <span>{user?.firstName || user?.username}</span>
                </button>
                <div className="nav-dropdown-menu">
                  <Link to="/profile" className="nav-dropdown-item">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="nav-dropdown-item">
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button className="navbar-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;


