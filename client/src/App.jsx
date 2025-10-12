import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/books")
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  }, []);

  return (
    <div>
      <h1>📚 My Reading List</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {books.length > 0 ? (
          books.map((book) => (
            <div
              key={book._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "10px",
                width: "200px",
              }}
            >
              <img
                src={book.coverImage || "https://via.placeholder.com/150"}
                alt={book.title}
                style={{ width: "100%", borderRadius: "8px" }}
              />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </div>
          ))
        ) : (
          <p>No books found yet.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
