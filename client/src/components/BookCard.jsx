import React, { useState } from "react";
import axios from "axios";

function BookCard({ book, onBookDeleted, onStatusUpdated }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/books/${book._id}`);
      onBookDeleted();
    } catch (error) {
      console.error("❌ Error deleting book:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    try {
      await axios.put(`http://localhost:5000/api/books/${book._id}`, {
        status: newStatus,
      });
      onStatusUpdated();
      console.log(`✅ Updated status for ${book.title} → ${newStatus}`);
    } catch (error) {
      console.error("❌ Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        margin: "10px",
        width: "200px",
        textAlign: "center",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src={book.coverImage || "https://via.placeholder.com/100x150?text=No+Cover"}
        alt={book.title}
        style={{
          width: "100px",
          height: "150px",
          objectFit: "cover",
          borderRadius: "6px",
          marginBottom: "8px",
        }}
      />
      <h3 style={{ fontSize: "1rem", margin: "5px 0" }}>{book.title}</h3>
      <p style={{ color: "#555", margin: "4px 0" }}>{book.author}</p>

      <div>
        <label htmlFor={`status-${book._id}`}>Status: </label>
        <select
          id={`status-${book._id}`}
          value={book.status || "Wishlist"}
          onChange={handleStatusChange}
          disabled={isUpdating}
        >
          <option value="Wishlist">Wishlist</option>
          <option value="Reading">Reading</option>
          <option value="Read">Read</option>
        </select>
      </div>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        style={{
          marginTop: "10px",
          backgroundColor: isDeleting ? "#ccc" : "#ff4d4d",
          color: "white",
          border: "none",
          padding: "6px 10px",
          borderRadius: "4px",
          cursor: isDeleting ? "not-allowed" : "pointer",
        }}
      >
        {isDeleting ? "Deleting..." : "🗑️ Delete"}
      </button>
    </div>
  );
}

export default BookCard;
