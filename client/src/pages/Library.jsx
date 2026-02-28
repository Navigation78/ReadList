import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Loading from '../components/common/Loading'
import styles from './Library.module.css'

export default function Library() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('currently_reading')
  const [books, setBooks] = useState({
    want_to_read: [],
    currently_reading: [],
    finished: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function loadBooks() {
      try {
        setLoading(true)
        const allBooks = await bookService.getBooks(user.id)
        
        // Group books by status
        const grouped = {
          want_to_read: allBooks.filter(b => b.status === 'want_to_read'),
          currently_reading: allBooks.filter(b => b.status === 'currently_reading'),
          finished: allBooks.filter(b => b.status === 'finished')
        }
        
        setBooks(grouped)
      } catch (error) {
        console.error('Error loading books:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBooks()
  }, [user])

  const tabs = [
    { id: 'currently_reading', label: 'Currently Reading', count: books.currently_reading.length },
    { id: 'want_to_read', label: 'Want to Read', count: books.want_to_read.length },
    { id: 'finished', label: 'Finished', count: books.finished.length }
  ]

  const currentBooks = books[activeTab]

  if (loading) {
    return <Loading text="Loading your library..." />
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Library</h1>
          <p className={styles.subtitle}>
            {Object.values(books).flat().length} books total
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/search')}
          icon="+"
        >
          Add Book
        </Button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className={styles.tabCount}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className={styles.content}>
        {currentBooks.length === 0 ? (
          <Card variant="flat">
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📚</span>
              <h3 className={styles.emptyTitle}>No books here yet</h3>
              <p className={styles.emptyText}>
                {activeTab === 'currently_reading' && "Start reading a book to see it here"}
                {activeTab === 'want_to_read' && "Add books you want to read"}
                {activeTab === 'finished' && "Finish a book to see it here"}
              </p>
              <Button variant="primary" onClick={() => navigate('/search')}>
                Find Books
              </Button>
            </div>
          </Card>
        ) : (
          <div className={styles.booksGrid}>
            {currentBooks.map(book => (
              <Card 
                key={book.id} 
                variant="default" 
                hoverable
                onClick={() => navigate(`/book/${book.id}`)}
              >
                <div className={styles.bookCard}>
                  <div className={styles.bookCover}>
                    {book.cover_url ? (
                      <img src={book.cover_url} alt={book.title} />
                    ) : (
                      <div className={styles.placeholderCover}>
                        <span>📚</span>
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.bookInfo}>
                    <h3 className={styles.bookTitle}>{book.title}</h3>
                    <p className={styles.bookAuthor}>{book.author}</p>
                    
                    {activeTab === 'currently_reading' && book.page_count && (
                      <div className={styles.progress}>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill}
                            style={{ 
                              width: `${(book.current_page / book.page_count) * 100}%` 
                            }}
                          />
                        </div>
                        <span className={styles.progressText}>
                          {Math.round((book.current_page / book.page_count) * 100)}% complete
                        </span>
                      </div>
                    )}
                    
                    {activeTab === 'finished' && book.finished_at && (
                      <span className={styles.finishedDate}>
                        Finished {new Date(book.finished_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}