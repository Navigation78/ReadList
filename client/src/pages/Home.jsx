import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Loading from '../components/common/Loading'
import styles from './Home.module.css'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [currentlyReading, setCurrentlyReading] = useState([])
  const [stats, setStats] = useState({
    totalBooks: 0,
    booksRead: 0,
    currentlyReading: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function loadData() {
      try {
        setLoading(true)
        
        // Get currently reading books
        const reading = await bookService.getBooksByStatus(user.id, 'currently_reading')
        setCurrentlyReading(reading)
        
        // Get all books for stats
        const allBooks = await bookService.getBooks(user.id)
        const finished = allBooks.filter(b => b.status === 'finished')
        
        setStats({
          totalBooks: allBooks.length,
          booksRead: finished.length,
          currentlyReading: reading.length
        })
      } catch (error) {
        console.error('Error loading home data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  if (loading) {
    return <Loading text="Loading your dashboard..." />
  }

  return (
    <div className={styles.container}>
      {/* Welcome Section */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome back! 📚</h1>
          <p className={styles.subtitle}>
            {currentlyReading.length > 0 
              ? `You're currently reading ${currentlyReading.length} ${currentlyReading.length === 1 ? 'book' : 'books'}`
              : "Start your reading journey today"}
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

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <Card variant="default" hoverable>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>📖</span>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.currentlyReading}</span>
              <span className={styles.statLabel}>Currently Reading</span>
            </div>
          </div>
        </Card>

        <Card variant="default" hoverable>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>✓</span>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.booksRead}</span>
              <span className={styles.statLabel}>Books Finished</span>
            </div>
          </div>
        </Card>

        <Card variant="default" hoverable>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>📚</span>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.totalBooks}</span>
              <span className={styles.statLabel}>Total Books</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Currently Reading Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Currently Reading</h2>
          <Link to="/library" className={styles.viewAll}>
            View All →
          </Link>
        </div>

        {currentlyReading.length === 0 ? (
          <Card variant="flat">
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📖</span>
              <h3 className={styles.emptyTitle}>No books in progress</h3>
              <p className={styles.emptyText}>
                Start reading a book from your library or add a new one
              </p>
              <div className={styles.emptyActions}>
                <Button variant="primary" onClick={() => navigate('/search')}>
                  Find a Book
                </Button>
                <Button variant="outline" onClick={() => navigate('/library')}>
                  Go to Library
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className={styles.booksGrid}>
            {currentlyReading.slice(0, 4).map(book => (
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
                    
                    {book.page_count && (
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
                          {book.current_page} / {book.page_count} pages
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <Card variant="flat" hoverable onClick={() => navigate('/library')}>
            <div className={styles.actionCard}>
              <span className={styles.actionIcon}>📚</span>
              <span className={styles.actionLabel}>My Library</span>
            </div>
          </Card>

          <Card variant="flat" hoverable onClick={() => navigate('/search')}>
            <div className={styles.actionCard}>
              <span className={styles.actionIcon}>🔍</span>
              <span className={styles.actionLabel}>Search Books</span>
            </div>
          </Card>

          <Card variant="flat" hoverable onClick={() => navigate('/stats')}>
            <div className={styles.actionCard}>
              <span className={styles.actionIcon}>📊</span>
              <span className={styles.actionLabel}>Statistics</span>
            </div>
          </Card>

          <Card variant="flat" hoverable onClick={() => navigate('/profile')}>
            <div className={styles.actionCard}>
              <span className={styles.actionIcon}>⚙️</span>
              <span className={styles.actionLabel}>Settings</span>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}