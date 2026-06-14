import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Loading from '../components/common/Loading'
import Modal from '../components/common/Modal'
import styles from './SearchBooks.module.css'
import { Search, BookOpen, Plus, CheckCircle, AlertCircle } from 'lucide-react'

export default function SearchBooks() {
  const { user } = useAuth()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [addingBook, setAddingBook] = useState(false)
  const [addedIds, setAddedIds] = useState(new Set())
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

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
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setResults(data.items || [])
      if (!data.items?.length) setError('No books found. Try a different search term.')
    } catch {
      setError('Failed to search books. Please try again.')
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
        title:           info.title,
        author:          info.authors?.join(', ') || 'Unknown Author',
        description:     info.description || null,
        cover_url:       info.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
        page_count:      info.pageCount || null,
        isbn:            info.industryIdentifiers?.[0]?.identifier || null,
        published_year:  info.publishedDate ? parseInt(info.publishedDate.substring(0, 4)) : null,
        status,
        current_page:    0,
      }
      await bookService.addBook(user.id, bookData)
      setAddedIds(prev => new Set([...prev, selectedBook.id]))
      setShowModal(false)
      setSelectedBook(null)
      showToast(`"${info.title}" added to your library!`)
    } catch {
      showToast('Failed to add book. It might already be in your library.', 'error')
    } finally {
      setAddingBook(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'error' ? styles.toastError : styles.toastSuccess}`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Search Books</h1>
        <p className={styles.subtitle}>Find your next great read and add it to your library</p>
      </div>

      {/* Search Form */}
      <form onSubmit={searchBooks} className={styles.searchForm}>
        <div className={styles.searchInputWrap}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by title, author, or ISBN…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit" variant="primary" disabled={loading || !query.trim()} loading={loading}>
          Search
        </Button>
      </form>

      {/* Error */}
      {error && (
        <div className={styles.errorMsg}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Loading */}
      {loading && <Loading text="Searching for books…" />}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className={styles.results}>
          <p className={styles.resultsCount}>
            <Search size={14} /> {results.length} results found
          </p>
          <div className={styles.resultsGrid}>
            {results.map(book => (
              <SearchBookCard
                key={book.id}
                book={book}
                onAdd={handleAddClick}
                added={addedIds.has(book.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => !addingBook && setShowModal(false)}
        title="Add to Library"
        size="small"
      >
        <div className={styles.modalContent}>
          <p className={styles.modalText}>
            Where would you like to add<br />
            <strong>"{selectedBook?.volumeInfo?.title}"</strong>?
          </p>
          <div className={styles.modalButtons}>
            <Button variant="outline"   fullWidth onClick={() => addBookToLibrary('want_to_read')}      disabled={addingBook} loading={addingBook}>Want to Read</Button>
            <Button variant="secondary" fullWidth onClick={() => addBookToLibrary('currently_reading')} disabled={addingBook}>Currently Reading</Button>
            <Button variant="primary"   fullWidth onClick={() => addBookToLibrary('finished')}          disabled={addingBook}>Already Read</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function SearchBookCard({ book, onAdd, added }) {
  const info = book.volumeInfo
  return (
    <div className={styles.bookCard}>
      <div className={styles.bookCover}>
        {info.imageLinks?.thumbnail ? (
          <img src={info.imageLinks.thumbnail.replace('http:', 'https:')} alt={info.title} />
        ) : (
          <div className={styles.placeholderCover}>
            <BookOpen size={28} color="#fff" />
          </div>
        )}
      </div>

      <div className={styles.bookInfo}>
        <h3 className={styles.bookTitle}>{info.title}</h3>
        <p className={styles.bookAuthor}>{info.authors?.join(', ') || 'Unknown Author'}</p>

        <div className={styles.bookMeta}>
          {info.publishedDate && (
            <span className={styles.metaChip}>{info.publishedDate.substring(0, 4)}</span>
          )}
          {info.pageCount && (
            <span className={styles.metaChip}>{info.pageCount} pages</span>
          )}
        </div>

        {info.description && (
          <p className={styles.bookDescription}>
            {info.description.substring(0, 130)}{info.description.length > 130 ? '…' : ''}
          </p>
        )}

        {added ? (
          <div className={styles.addedBadge}>
            <CheckCircle size={14} /> Added to library
          </div>
        ) : (
          <Button variant="primary" size="small" fullWidth onClick={() => onAdd(book)}>
            <Plus size={14} /> Add to Library
          </Button>
        )}
      </div>
    </div>
  )
}
