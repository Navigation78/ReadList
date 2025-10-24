// src/components/BookList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "./BookCard";
import BookSearch from "./BookSearch";

function BookList() {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data);
    } catch (error) {
      console.error("❌ Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📖 My Reading Tracker</h1>

      <BookSearch onBookAdded={fetchBooks} />

      <h2>My Books</h2>
      {books.length === 0 ? (
        <p>No books saved yet. Try searching for one!</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onBookDeleted={fetchBooks}
              onStatusUpdated={fetchBooks}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookList;
