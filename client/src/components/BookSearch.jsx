// src/components/BookSearch.jsx
import React, { useState } from "react";
import axios from "axios";

function BookSearch({ onBookAdded }) {
  const [query, setQuery] = useState("");       // User's search text
  const [results, setResults] = useState([]);   // Search results from Google Books
  const [status, setStatus] = useState("Wishlist"); // Book status before adding

  // Load API key from environment variable
  const apiKey = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;

  // Handles search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return; // avoid empty searches

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`
      );
      const data = await response.json();
      setResults(data.items || []);
    } catch (error) {
      console.error("❌ Error fetching books:", error);
    }
  };

  // Handles adding a book to the backend database
  const handleAddBook = async (book) => {
    const bookData = {
      googleBookId: book.id,
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors?.[0] || "Unknown Author",
      coverImage: book.volumeInfo.imageLinks?.thumbnail || "",
      status, // the selected reading status
    };

    try {
      await axios.post("http://localhost:5000/api/books", bookData);
      onBookAdded(); // refresh parent book list
      alert(`✅ Added "${book.volumeInfo.title}" as "${status}"`);
    } catch (error) {
      console.error("❌ Error adding book:", error);
      alert("Book already exists or could not be added.");
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      {/* Search bar */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "8px", width: "250px" }}
        />
        <button type="submit">🔍 Search</button>
      </form>

      {/* Status selector */}
      <div style={{ marginTop: "10px" }}>
        <label>Set Status: </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: "4px" }}
        >
          <option value="Wishlist">Wishlist</option>
          <option value="Reading">Reading</option>
          <option value="Read">Read</option>
        </select>
      </div>

      {/* Display search results */}
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
        {results.map((book) => (
          <div
            key={book.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "10px",
              margin: "10px",
              width: "200px",
              textAlign: "center",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <img
              src={book.volumeInfo.imageLinks?.thumbnail}
              alt={book.volumeInfo.title}
              style={{ width: "100px", height: "150px", objectFit: "cover" }}
            />
            <h4>{book.volumeInfo.title}</h4>
            <p>{book.volumeInfo.authors?.join(", ")}</p>
            <button
              onClick={() => handleAddBook(book)}
              style={{
                marginTop: "10px",
                padding: "6px 10px",
                border: "none",
                borderRadius: "5px",
                backgroundColor: "#4caf50",
                color: "white",
                cursor: "pointer",
              }}
            >
              ➕ Add to Library
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookSearch;
