// src/components/BookSearch.jsx
import React, { useState } from "react";
import axios from "axios";

function BookSearch({ onBookAdded }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("Wishlist");

  const handleSearch = async (e) => {
    e.preventDefault();

    const apiKey = "YOUR_API_KEY"; // Replace with your real Google Books API key
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`
    );
    const data = await response.json();
    setResults(data.items || []);
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
      await axios.post("http://localhost:5000/api/books", bookData);
      onBookAdded();
      alert(`✅ Added "${book.volumeInfo.title}" as "${status}"`);
    } catch (error) {
      console.error("❌ Error adding book:", error);
      alert("Book already exists or could not be added.");
    }
  };

  return (
    <div style={{ margin: "20px" }}>
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

      <div style={{ marginTop: "10px" }}>
        <label>Set Status: </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Wishlist">Wishlist</option>
          <option value="Reading">Reading</option>
          <option value="Read">Read</option>
        </select>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
        {results.map((book) => (
          <div key={book.id} style={{
            border: "1px solid #ddd",
            padding: "10px",
            margin: "10px",
            width: "200px",
            textAlign: "center"
          }}>
            <img
              src={book.volumeInfo.imageLinks?.thumbnail}
              alt={book.volumeInfo.title}
              style={{ width: "100px", height: "150px", objectFit: "cover" }}
            />
            <h4>{book.volumeInfo.title}</h4>
            <p>{book.volumeInfo.authors?.join(", ")}</p>
            <button onClick={() => handleAddBook(book)}>➕ Add to Library</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookSearch;
