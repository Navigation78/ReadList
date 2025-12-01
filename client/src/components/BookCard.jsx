import React, { useState } from "react";
import axios from "axios";
import { supabase } from '../lib/supabaseClient';

function BookCard({ book, onBookDeleted, onStatusUpdated }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      await axios.delete(`http://localhost:5000/api/books/${book._id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
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
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      await axios.put(`http://localhost:5000/api/books/${book._id}`, { status: newStatus }, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      onStatusUpdated();
      console.log(` Updated status for ${book.title} → ${newStatus}`);
    } catch (error) {
      console.error(" Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Status badge colors
  const statusColors = {
    Wishlist: 'bg-[#ABC270] text-white',
    Reading: 'bg-[#FEC868] text-[#473C33]',
    Read: 'bg-[#FDA769] text-white'
  };

  return (
    <div id="book-card-container" className="bg-white border-2 border-gray-200 rounded-lg p-5 w-56 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:border-[#FEC868]">
      {/* Book Cover */}
      <div id="book-cover-section" className="relative mb-4 group">
        <img
          id="book-cover-image"
          src={book.coverImage || "https://via.placeholder.com/100x150?text=No+Cover"}
          alt={book.title}
          className="w-full h-64 object-cover rounded-lg shadow-md group-hover:opacity-95 transition-opacity"
        />
        {/* Status Badge */}
        <span id="book-status-badge" className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[book.status] || statusColors.Wishlist}`}>
          {book.status || "Wishlist"}
        </span>
      </div>

      {/* Book Info */}
      <div id="book-info-section" className="mb-4">
        <h3 className="text-base font-bold text-[#473C33] mb-1 line-clamp-2 min-h-[2.5rem]">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600">{book.author}</p>
      </div>

      {/* Status Selector */}
      <div id="status-selector-section" className="mb-4">
        <label htmlFor={`status-${book._id}`} className="block text-xs font-semibold text-[#473C33] mb-2">
          Update Status
        </label>
        <select
          id={`status-${book._id}`}
          value={book.status || "Wishlist"}
          onChange={handleStatusChange}
          disabled={isUpdating}
          className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-[#FEC868] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="Wishlist"> Wishlist</option>
          <option value="Reading"> Reading</option>
          <option value="Read"> Read</option>
        </select>
      </div>

      {/* Delete Button */}
      <button
        id="delete-book-btn"
        onClick={handleDelete}
        disabled={isDeleting}
        className="w-full px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isDeleting ? "Deleting..." : "Delete Book"}
      </button>
    </div>
  );
}

export default BookCard;