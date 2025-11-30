// src/components/BookList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from '../lib/supabaseClient';
import BookCard from "./BookCard";
import BookSearch from "./BookSearch";

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const res = await axios.get("http://localhost:5000/api/books", {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      setBooks(res.data);
    } catch (error) {
      console.error("❌ Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Group books by status
  const booksByStatus = {
    Wishlist: books.filter(book => book.status === 'Wishlist'),
    Reading: books.filter(book => book.status === 'Reading'),
    Read: books.filter(book => book.status === 'Read')
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#ABC270] to-[#FEC868] text-white py-8 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">📖 My Reading Tracker</h1>
          <p className="text-lg opacity-90">Track your reading journey, one book at a time</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <BookSearch onBookAdded={fetchBooks} />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border-2 border-[#ABC270] rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Wishlist</p>
                <p className="text-3xl font-bold text-[#ABC270]">{booksByStatus.Wishlist.length}</p>
              </div>
              <span className="text-4xl">📚</span>
            </div>
          </div>
          
          <div className="bg-white border-2 border-[#FEC868] rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Currently Reading</p>
                <p className="text-3xl font-bold text-[#FEC868]">{booksByStatus.Reading.length}</p>
              </div>
              <span className="text-4xl">📖</span>
            </div>
          </div>
          
          <div className="bg-white border-2 border-[#FDA769] rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Completed</p>
                <p className="text-3xl font-bold text-[#FDA769]">{booksByStatus.Read.length}</p>
              </div>
              <span className="text-4xl">✅</span>
            </div>
          </div>
        </div>

        {/* Books Display */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FEC868] border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading your books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <span className="text-6xl mb-4 block">📚</span>
            <h3 className="text-xl font-bold text-[#473C33] mb-2">No books yet!</h3>
            <p className="text-gray-600">Start building your reading list by searching for books above.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Wishlist Section */}
            {booksByStatus.Wishlist.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#473C33] mb-4 flex items-center">
                  <span className="mr-2">📚</span> Wishlist
                  <span className="ml-3 text-sm font-normal bg-[#ABC270] text-white px-3 py-1 rounded-full">
                    {booksByStatus.Wishlist.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {booksByStatus.Wishlist.map((book) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      onBookDeleted={fetchBooks}
                      onStatusUpdated={fetchBooks}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Currently Reading Section */}
            {booksByStatus.Reading.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#473C33] mb-4 flex items-center">
                  <span className="mr-2">📖</span> Currently Reading
                  <span className="ml-3 text-sm font-normal bg-[#FEC868] text-[#473C33] px-3 py-1 rounded-full">
                    {booksByStatus.Reading.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {booksByStatus.Reading.map((book) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      onBookDeleted={fetchBooks}
                      onStatusUpdated={fetchBooks}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Section */}
            {booksByStatus.Read.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#473C33] mb-4 flex items-center">
                  <span className="mr-2">✅</span> Completed
                  <span className="ml-3 text-sm font-normal bg-[#FDA769] text-white px-3 py-1 rounded-full">
                    {booksByStatus.Read.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {booksByStatus.Read.map((book) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      onBookDeleted={fetchBooks}
                      onStatusUpdated={fetchBooks}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookList;