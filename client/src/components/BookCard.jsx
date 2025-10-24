// src/components/BookCard.jsx
import React from "react";
import axios from "axios";

function BookCard({ book, onBookDeleted, onStatusUpdated }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${book._id}`);
      onBookDeleted();
    } catch (error) {
      console.error("❌ Error deleting book:", error);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await axios.put(`http://localhost:5000/api/books/${book._id}`, {
        status: newStatus,
      });
      onStatusUpdated();
    } catch (error) {
      console.error("❌ Error updating status:", error);
    }
  };

  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "10px",
      margin: "10px",
      width: "200px",
      textAlign: "center"
    }}>
      <img
        src={book.coverImage}
        alt={book.title}
        style={{ width: "100px", height: "150px", objectFit: "cover" }}
      />
      <h3>{book.title}</h3>
      <p>{book.author}</p>

      <label>Status:</label>
      <select value={book.status} onChange={handleStatusChange}>
        <option value="Wishlist">Wishlist</option>
        <option value="Reading">Reading</option>
        <option value="Read">Read</option>
      </select>

      <br />
      <button onClick={handleDelete}>🗑️ Delete</button>
    </div>
  );
}

export default BookCard;
