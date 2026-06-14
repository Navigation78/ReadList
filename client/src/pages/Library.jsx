import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Button from '../components/common/Button'
import Loading from '../components/common/Loading'
import styles from './Library.module.css'
import {
  BookOpen, BookMarked, CheckCircle, Plus, Search,
  TrendingUp, Clock
} from 'lucide-react'

const TABS = [
  { id: 'currently_reading', label: 'Reading',    icon: BookOpen     },
  { id: 'want_to_read',      label: 'Want to Read', icon: BookMarked  },
  { id: 'finished',          label: 'Finished',   icon: CheckCircle  },
]

export default function Library() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('currently_reading')
  const [books, setBooks] = useState({
    want_to_read: [],
    currently_reading: [],
    finished: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function loadBooks() {
      try {
        setLoading(true)
        const allBooks = await bookService.getBooks(user.id)
        setBooks({
          want_to_read:       allBooks.filter(b => b.status === 'want_to_read'),
          currently_reading:  allBooks.filter(b => b.status === 'currently_reading'),
          finished:           allBooks.filter(b => b.status === 'finished'),
        })
      } catch (error) {
        console.error('Error loading books:', error)
      } finally {
        setLoading(false)
      }
    }
    loadBooks()
  }, [user])

  const currentBooks = books[activeTab]
  const total = Object.values(books).flat().length

  if (loading) return <Loading text="Loading your library..." />

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Library</h1>
          <p className={styles.subtitle}>{total} {total === 1 ? 'book' : 'books'} in your collection</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/search')}>
          <Plus size={16} /> Add Book
        </Button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`${styles.tab} ${activeTab === id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={15} />
            {label}
            <span className={styles.tabCount}>{books[id].length}</span>
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className={styles.content}>
        {currentBooks.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrap}>
              <Search size={32} />
            </div>
            <h3 className={styles.emptyTitle}>No books here yet</h3>
            <p className={styles.emptyText}>
              {activeTab === 'currently_reading' && 'Start reading a book to track your progress here.'}
              {activeTab === 'want_to_read'      && 'Add books you want to read to build your reading list.'}
              {activeTab === 'finished'          && "Finish a book and it'll show up here."}
            </p>
            <Button variant="primary" onClick={() => navigate('/search')}>
              <Search size={15} /> Find Books
            </Button>
          </div>
        ) : (
          <div className={styles.booksGrid}>
            {currentBooks.map(book => (
              <div
                key={book.id}
                className={styles.bookCard}
                onClick={() => navigate(`/book/${book.id}`)}
              >
                <div className={styles.bookCover}>
                  {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} />
                  ) : (
                    <div className={styles.placeholderCover}>
                      <BookOpen size={36} color="#fff" />
                    </div>
                  )}

                  {activeTab === 'finished' && (
                    <div className={styles.finishedBadge}>
                      <CheckCircle size={14} />
                    </div>
                  )}
                </div>

                <div className={styles.bookInfo}>
                  <h3 className={styles.bookTitle}>{book.title}</h3>
                  <p className={styles.bookAuthor}>{book.author}</p>

                  {activeTab === 'currently_reading' && book.page_count > 0 && (
                    <div className={styles.progressWrap}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${Math.min(100, (book.current_page / book.page_count) * 100)}%` }}
                        />
                      </div>
                      <div className={styles.progressMeta}>
                        <span className={styles.progressText}>
                          <TrendingUp size={11} />
                          {Math.round((book.current_page / book.page_count) * 100)}%
                        </span>
                        <span className={styles.progressPages}>{book.current_page}/{book.page_count} pages</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'finished' && book.finished_at && (
                    <span className={styles.finishedDate}>
                      <Clock size={11} />
                      {new Date(book.finished_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
