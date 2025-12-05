import React, { useState } from "react";
import axios from "axios";
import { supabase } from "../lib/supabaseClient";
import { Star, Trash2, ChevronDown, BookOpen } from "lucide-react";

function BookCard({ book, onBookDeleted, onStatusUpdated }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusColors = {
    Wishlist: "from-emerald-500 to-teal-600",
    Reading: "from-amber-500 to-orange-600",
    Read: "from-rose-500 to-pink-600",
  };

  //  DELETE BOOK
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      await axios.delete(`http://localhost:5000/api/books/${book._id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      onBookDeleted();
    } catch (error) {
      console.error("❌ Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // UPDATE STATUS
  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      await axios.put(
        `http://localhost:5000/api/books/${book._id}`,
        { status: newStatus },
        {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        }
      );

      onStatusUpdated();
      setShowMenu(false);
    } catch (error) {
      console.error("❌ Status update failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105">
      
      {/*  STATUS GRADIENT BAR */}
      <div className={`h-2 bg-gradient-to-r ${statusColors[book.status]}`}></div>

      {/*  BOOK COVER */}
      <div className="relative h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <BookOpen className="w-20 h-20 text-gray-400" />
        )}

        {/*  HOVER ACTIONS */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">

          {/* DROPDOWN TO CHANGE STATUS */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="bg-white text-gray-800 p-3 rounded-full hover:bg-gray-100 shadow-lg"
          >
            <ChevronDown size={20} />
          </button>

          {/* DELETE */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 shadow-lg"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/*  BOOK INFO */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 text-sm">
          {book.title}
        </h3>

        <p className="text-xs text-gray-600 mb-3">{book.author}</p>

        {/* RATING STARS (ONLY IF READ) */}
        {book.status === "Read" && (
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < (book.rating || 4)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        )}

        {/* STATUS DROPDOWN MENU */}
        {showMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 z-10 overflow-hidden">
            {["Wishlist", "Reading", "Read"].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={isUpdating}
                className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition ${
                  book.status === status ? "bg-gray-100 font-semibold" : ""
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookCard;
