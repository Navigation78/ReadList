import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import './SearchBooks.css'

export default function SearchBooks() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const searchBooks = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20&key=${apiKey}`
      )
      
      if (!response.ok) throw new Error('Failed to fetch books')
      
      const data = await response.json()
      setResults(data.items || [])
    } catch (err) {
      setError(err.message)
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const addBookToLibrary = async (googleBook, status) => {
    try {
      const bookData = {
        google_books_id: googleBook.id,
        title: googleBook.volumeInfo.title,
        author: googleBook.volumeInfo.authors?.join(', ') || 'Unknown Author',
        description: googleBook.volumeInfo.description || '',
        cover_url: googleBook.volumeInfo.imageLinks?.thumbnail || '',
        page_count: googleBook.volumeInfo.pageCount || null,
        isbn: googleBook.volumeInfo.industryIdentifiers?.[0]?.identifier || null,
        published_year: googleBook.volumeInfo.publishedDate ? 
          parseInt(googleBook.volumeInfo.publishedDate.substring(0, 4)) : null,
        status: status,
        current_page: 0
      }

      await bookService.addBook(user.id, bookData)
      alert('Book added to your library!')
    } catch (err) {
      console.error('Error adding book:', err)
      alert('Failed to add book. Please try again.')
    }
  }

  return (
    <div className="search-container">
      <div className="search-header">
        <h1 className="search-title">Search Books</h1>
        <p className="search-subtitle">Find your next great read</p>
      </div>

      {/* Search Form */}
      <form onSubmit={searchBooks} className="search-form">
        <input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {/* Results */}
      <div className="results-section">
        {loading ? (
          <div className="loading">Searching for books...</div>
        ) : results.length > 0 ? (
          <>
            <p className="results-count">{results.length} results found</p>
            <div className="results-grid">
              {results.map((book) => (
                <SearchBookCard
                  key={book.id}
                  book={book}
                  onAdd={addBookToLibrary}
                />
              ))}
            </div>
          </>
        ) : query && !loading ? (
          <div className="empty-state">
            <p>No books found. Try a different search term.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

// Search Result Card Component
function SearchBookCard({ book, onAdd }) {
  const [showMenu, setShowMenu] = useState(false)
  const info = book.volumeInfo

  return (
    <div className="search-book-card">
      <div className="book-cover-wrapper">
        {info.imageLinks?.thumbnail ? (
          <img 
            src={info.imageLinks.thumbnail} 
            alt={info.title}
            className="book-cover"
          />
        ) : (
          <div className="book-cover-placeholder">
            <span>No Cover</span>
          </div>
        )}
      </div>

      <div className="book-info">
        <h3 className="book-title">{info.title}</h3>
        <p className="book-author">{info.authors?.join(', ') || 'Unknown Author'}</p>
        {info.publishedDate && (
          <p className="book-year">{info.publishedDate.substring(0, 4)}</p>
        )}
        {info.pageCount && (
          <p className="book-pages">{info.pageCount} pages</p>
        )}
      </div>

      <div className="book-actions">
        <button 
          className="btn-add"
          onClick={() => setShowMenu(!showMenu)}
        >
          + Add to Library
        </button>

        {showMenu && (
          <div className="add-menu">
            <button onClick={() => { onAdd(book, 'want_to_read'); setShowMenu(false) }}>
              Want to Read
            </button>
            <button onClick={() => { onAdd(book, 'currently_reading'); setShowMenu(false) }}>
              Currently Reading
            </button>
            <button onClick={() => { onAdd(book, 'finished'); setShowMenu(false) }}>
              Already Read
            </button>
          </div>
        )}
      </div>
    </div>
  )
}