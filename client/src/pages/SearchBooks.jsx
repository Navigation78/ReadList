import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Card from '../components/common/Card'
import Loading from '../components/common/Loading'
import Modal from '../components/common/Modal'
import styles from './SearchBooks.module.css'

export default function SearchBooks() {
  const { user } = useAuth()
  
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [addingBook, setAddingBook] = useState(false)

  const searchBooks = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setResults([])

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20&key=${apiKey}`
      )
      
      if (!response.ok) throw new Error('Failed to fetch books')
      
      const data = await response.json()
      setResults(data.items || [])
      
      if (!data.items || data.items.length === 0) {
        setError('No books found. Try a different search term.')
      }
    } catch (err) {
      setError('Failed to search books. Please try again.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClick = (book) => {
    setSelectedBook(book)
    setShowModal(true)
  }

  const addBookToLibrary = async (status) => {
    if (!selectedBook) return

    try {
      setAddingBook(true)
      const info = selectedBook.volumeInfo

      const bookData = {
        google_books_id: selectedBook.id,
        title: info.title,
        author: info.authors?.join(', ') || 'Unknown Author',
        description: info.description || null,
        cover_url: info.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
        page_count: info.pageCount || null,
        isbn: info.industryIdentifiers?.[0]?.identifier || null,
        published_year: info.publishedDate ? 
          parseInt(info.publishedDate.substring(0, 4)) : null,
        status: status,
        current_page: 0
      }

      await bookService.addBook(user.id, bookData)
      
      setShowModal(false)
      setSelectedBook(null)
      alert('Book added to your library!')
      
      // Remove from results
      setResults(prev => prev.filter(b => b.id !== selectedBook.id))
    } catch (err) {
      console.error('Error adding book:', err)
      alert('Failed to add book. It might already be in your library.')
    } finally {
      setAddingBook(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Search Books</h1>
        <p className={styles.subtitle}>Find your next great read</p>
      </div>

      {/* Search Form */}
      <form onSubmit={searchBooks} className={styles.searchForm}>
        <Input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
        />
        <Button 
          type="submit" 
          variant="primary" 
          disabled={loading || !query.trim()}
          loading={loading}
        >
          Search
        </Button>
      </form>

      {/* Error */}
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && <Loading text="Searching for books..." />}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className={styles.results}>
          <p className={styles.resultsCount}>
            Found {results.length} books
          </p>
          
          <div className={styles.resultsGrid}>
            {results.map((book) => (
              <SearchBookCard
                key={book.id}
                book={book}
                onAdd={handleAddClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => !addingBook && setShowModal(false)}
        title="Add to Library"
        size="small"
      >
        <div className={styles.modalContent}>
          <p className={styles.modalText}>
            Where would you like to add "{selectedBook?.volumeInfo?.title}"?
          </p>
          
          <div className={styles.modalButtons}>
            <Button
              variant="primary"
              fullWidth
              onClick={() => addBookToLibrary('want_to_read')}
              disabled={addingBook}
              loading={addingBook}
            >
              Want to Read
            </Button>
            
            <Button
              variant="secondary"
              fullWidth
              onClick={() => addBookToLibrary('currently_reading')}
              disabled={addingBook}
            >
              Currently Reading
            </Button>
            
            <Button
              variant="outline"
              fullWidth
              onClick={() => addBookToLibrary('finished')}
              disabled={addingBook}
            >
              Already Read
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// Search Result Card Component
function SearchBookCard({ book, onAdd }) {
  const info = book.volumeInfo

  return (
    <Card variant="default" hoverable>
      <div className={styles.bookCard}>
        <div className={styles.bookCover}>
          {info.imageLinks?.thumbnail ? (
            <img 
              src={info.imageLinks.thumbnail.replace('http:', 'https:')} 
              alt={info.title}
            />
          ) : (
            <div className={styles.placeholderCover}>
              <span>📚</span>
            </div>
          )}
        </div>

        <div className={styles.bookInfo}>
          <h3 className={styles.bookTitle}>{info.title}</h3>
          <p className={styles.bookAuthor}>
            {info.authors?.join(', ') || 'Unknown Author'}
          </p>
          
          <div className={styles.bookMeta}>
            {info.publishedDate && (
              <span className={styles.metaItem}>
                {info.publishedDate.substring(0, 4)}
              </span>
            )}
            {info.pageCount && (
              <span className={styles.metaItem}>
                {info.pageCount} pages
              </span>
            )}
          </div>

          {info.description && (
            <p className={styles.bookDescription}>
              {info.description.substring(0, 150)}
              {info.description.length > 150 ? '...' : ''}
            </p>
          )}

          <Button
            variant="primary"
            size="small"
            fullWidth
            onClick={() => onAdd(book)}
          >
            + Add to Library
          </Button>
        </div>
      </div>
    </Card>
  )
}