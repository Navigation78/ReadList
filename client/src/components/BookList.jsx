import React, { useEffect, useState } from "react";
import axios from "axios";
import BookForm from "./BookForm";

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
    <div>
      <BookForm onBookAdded={fetchBooks} />
      <h2>📚 Your Reading List</h2>

      {books.length === 0 ? (
        <p>No books found yet.</p>
      ) : (
        books.map((book) => (
          <div key={book._id}>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <small>{book.status}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default BookList;
