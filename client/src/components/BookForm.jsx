import React, { useState } from "react";
import axios from "axios";

function BookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // For now, just send title + author (we’ll handle file later)
    try {
      const response = await axios.post("http://localhost:5000/api/books", {
        title,
        author,
      });

      console.log("Book added:", response.data);
      alert("✅ Book added successfully!");

      // clear form
      setTitle("");
      setAuthor("");
      setFile(null);
    } catch (error) {
      console.error("❌ Error adding book:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "20px" }}>
      <div>
        <label>📖 Title: </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>✍️ Author: </label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>

      <div>
        <label>📂 Upload file: </label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <button type="submit">Add Book</button>
    </form>
  );
}

export default BookForm;
