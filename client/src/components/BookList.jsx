import React, { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "../lib/supabaseClient";
import BookCard from "../components/BookCard"; // reuse existing card

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔁 Central fetch (MongoDB is source of truth)
  const fetchBooks = async () => {
    try {
      setLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const res = await axios.get("http://localhost:5000/api/books", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      setBooks(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchBooks();
  }, []);

  // Group by status
  const wishlist = books.filter((b) => b.status === "Wishlist");
  const reading = books.filter((b) => b.status === "Reading");
  const read = books.filter((b) => b.status === "Read");

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading your library…
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        📚 No books here yet
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
      
      {/* Wishlist */}
      {wishlist.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Wishlist
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {wishlist.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onBookDeleted={fetchBooks}
                onStatusUpdated={fetchBooks}
              />
            ))}
          </div>
        </section>
      )}

      {/* Reading */}
      {reading.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Reading
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {reading.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onBookDeleted={fetchBooks}
                onStatusUpdated={fetchBooks}
              />
            ))}
          </div>
        </section>
      )}

      {/* Read */}
      {read.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Read
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {read.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onBookDeleted={fetchBooks}
                onStatusUpdated={fetchBooks}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default BookList;
