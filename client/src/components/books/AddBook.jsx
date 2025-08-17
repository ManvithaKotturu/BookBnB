import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddBook = ({ onAddBook }) => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    dailyRate: "",
    location: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBook = {
      ...form,
      dailyRate: parseFloat(form.dailyRate) || 0,
      isAvailable: true,
      images: [],
      owner: { _id: "me", firstName: "Demo", lastName: "User" },
      averageRating: 0,
      totalRatings: 0,
    };

    onAddBook(newBook);

    navigate("/books"); // redirect back to books page
  };

  return (
    <div className="add-book">
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Author</label>
          <input name="author" value={form.author} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Genre</label>
          <input name="genre" value={form.genre} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Daily Rate ($/day)</label>
          <input type="number" name="dailyRate" value={form.dailyRate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input name="location" value={form.location} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-primary">Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;
