import React, { useState } from "react";
import axios from "axios";
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from "react-router-dom";


function BookSearch({ onBookAdded }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("Wishlist");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();


  // Correct way to load your API key
  const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setIsSearching(true);
      setHasSearched(true);
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&key=${apiKey}`
      );

      const data = await response.json();
      setResults(data.items || []);
    } catch (error) {
      console.error("❌ Error fetching books:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddBook = async (book) => {
    const bookData = {
      googleBookId: book.id,
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors?.[0] || "Unknown Author",
      coverImage: book.volumeInfo.imageLinks?.thumbnail || "",
      status,
    };

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      await axios.post("http://localhost:5000/api/books", bookData, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      onBookAdded();
      alert(` Added "${book.volumeInfo.title}" as "${status}"`);
       navigate("/"); 
    } catch (error) {
      console.error("❌ Error adding book:", error);
      alert("Book already exists or could not be added.");
    }
  };

  // Status badge colors
  const statusColors = {
    Wishlist: 'bg-[#ABC270] text-white',
    Reading: 'bg-[#FEC868] text-[#473C33]',
    Read: 'bg-[#FDA769] text-white'
  };

  return (
    <div id="book-search-container" className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Search Header */}
      <h2 id="search-header" className="text-xl font-bold text-[#473C33] mb-4">🔍 Search for Books</h2>

      {/* Search Form */}
      <div id="search-form" className="space-y-4">
        <div id="search-input-group" className="flex flex-col sm:flex-row gap-3">
          <input
            id="search-input"
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FEC868] focus:outline-none transition-colors"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="px-6 py-3 bg-[#FEC868] text-[#473C33] font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
          >
            {isSearching ? "Searching..." : "🔍 Search"}
          </button>
        </div>

        {/* Status Selector */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-[#473C33]">
            Add books as:
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FEC868] focus:outline-none transition-colors"
          >
            <option value="Wishlist"> Wishlist</option>
            <option value="Reading"> Reading</option>
            <option value="Read"> Read</option>
          </select>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Search Results */}
      <div className="mt-6">
        {isSearching ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#FEC868] border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Searching for books...</p>
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <span className="text-5xl mb-3 block">📭</span>
            <h3 className="text-lg font-bold text-[#473C33] mb-1">No results found</h3>
            <p className="text-gray-600 text-sm">Try a different search term</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#473C33]">
                Search Results ({results.length})
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((book) => (
                <div
                  key={book.id}
                  className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-[#FEC868] transition-all"
                >
                  <img
                    src={
                      book.volumeInfo.imageLinks?.thumbnail ||
                      "https://via.placeholder.com/100x150?text=No+Cover"
                    }
                    alt={book.volumeInfo.title}
                    className="w-full h-48 object-cover rounded-md mx-auto mb-3"
                  />
                  <h4 className="text-sm font-bold text-[#473C33] mb-1 line-clamp-2 min-h-[2.5rem]">
                    {book.volumeInfo.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-1">
                    {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                  </p>

                  <button
                    onClick={() => handleAddBook(book)}
                    className="w-full px-3 py-2 bg-[#ABC270] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all"
                  >
                    ➕ Add
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default BookSearch;