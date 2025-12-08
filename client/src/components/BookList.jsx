import React, { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from '../lib/supabaseClient';
import { Book, BookOpen, CheckCircle, Star, Trash2, ChevronDown } from 'lucide-react';

const BookCard = ({ book, onStatusChange, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const statusColors = {
    Wishlist: 'from-emerald-500 to-teal-600',
    Reading: 'from-amber-500 to-orange-600',
    Read: 'from-rose-500 to-pink-600'
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105">
      {/* Gradient Header */}
      <div className={`h-2 bg-gradient-to-r ${statusColors[book.status]}`}></div>

      {/* Book Cover */}
      <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
        {book.thumbnail ? (
          <img 
            src={book.thumbnail} 
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <Book className="w-20 h-20 text-gray-400" />
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="bg-white text-gray-800 p-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(book._id)}
            className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors shadow-lg"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 text-sm leading-tight">
          {book.title}
        </h3>
        <p className="text-xs text-gray-600 mb-3 line-clamp-1">{book.author}</p>

        {/* Rating */}
        {book.status === 'Read' && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < book.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
        )}

        {/* Status Dropdown */}
        {showMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-10">
            {['Wishlist', 'Reading', 'Read'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  onStatusChange(book._id, status);
                  setShowMenu(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                  book.status === status ? 'bg-gray-100 font-semibold' : ''
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
};

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
  try {
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    
    console.log("🔍 Session data:", sessionData);
    console.log("🔑 Token:", token ? "EXISTS" : "MISSING");
    console.log("📤 Sending token (first 20 chars):", token?.substring(0, 20)); 
      const res = await axios.get("http://localhost:5000/api/books", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
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

  const handleStatusChange = async (id, newStatus) => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    await axios.put(
      `http://localhost:5000/api/books/${id}`,
      { status: newStatus },
      {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      }
    );

    fetchBooks(); // ✅ re-sync from MongoDB
  } catch (error) {
    console.error("❌ Status update failed:", error);
  }
};


  const handleDelete = async (id) => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    await axios.delete(`http://localhost:5000/api/books/${id}`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });

    fetchBooks(); // ✅ re-sync from MongoDB
  } catch (error) {
    console.error("❌ Delete failed:", error);
  }
};


  const booksByStatus = {
    Wishlist: books.filter(b => b.status === 'Wishlist'),
    Reading: books.filter(b => b.status === 'Reading'),
    Read: books.filter(b => b.status === 'Read')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16 px-6 shadow-2xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
              <BookOpen className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-5xl font-bold mb-2 tracking-tight">My Reading Journey</h1>
              <p className="text-xl opacity-90 font-light">Track every page, celebrate every book</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 -mt-20 relative z-20">
          {[
            { title: 'Wishlist', books: booksByStatus.Wishlist, icon: Book, colors: 'from-emerald-500 to-teal-600', description: 'Books to discover' },
            { title: 'Currently Reading', books: booksByStatus.Reading, icon: BookOpen, colors: 'from-amber-500 to-orange-600', description: 'Active adventures' },
            { title: 'Completed', books: booksByStatus.Read, icon: CheckCircle, colors: 'from-rose-500 to-pink-600', description: 'Finished stories' },
          ].map((card) => (
            <div key={card.title} className={`bg-white rounded-2xl p-6 shadow-xl border hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-br ${card.colors} p-4 rounded-xl shadow-lg`}>
                  <card.icon className="w-8 h-8 text-white" />
                </div>
                <span className={`text-5xl font-bold bg-gradient-to-br ${card.colors} bg-clip-text text-transparent`}>
                  {card.books.length}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">{card.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Books Sections */}
        <div className="space-y-12">
          {['Wishlist', 'Reading', 'Read'].map((status) => {
            const statusBooks = booksByStatus[status];
            const Icon = status === 'Wishlist' ? Book : status === 'Reading' ? BookOpen : CheckCircle;
            const colors = status === 'Wishlist' ? 'from-emerald-500 to-teal-600' : status === 'Reading' ? 'from-amber-500 to-orange-600' : 'from-rose-500 to-pink-600';
            if (!statusBooks.length) return null;

            return (
              <div key={status}>
                <h2 className={`text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3`}>
                  <div className={`bg-gradient-to-br ${colors} p-2 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {status}
                  <span className={`text-base font-normal bg-gradient-to-r ${colors} text-white px-4 py-1 rounded-full`}>
                    {statusBooks.length}
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {statusBooks.map((book) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BookList;
