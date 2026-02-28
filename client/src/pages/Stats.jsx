import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Card from '../components/common/Card'
import Loading from '../components/common/Loading'
import styles from './Stats.module.css'

export default function Stats() {
  const { user } = useAuth()
  
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function loadBooks() {
      try {
        const data = await bookService.getBooks(user.id)
        setBooks(data)
      } catch (error) {
        console.error('Error loading books:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBooks()
  }, [user])

  if (loading) {
    return <Loading text="Loading statistics..." />
  }

  // Calculate stats
  const finishedBooks = books.filter(b => b.status === 'finished')
  const currentlyReading = books.filter(b => b.status === 'currently_reading')
  const wantToRead = books.filter(b => b.status === 'want_to_read')
  
  const totalPages = finishedBooks.reduce((sum, b) => sum + (b.page_count || 0), 0)
  const averagePages = finishedBooks.length > 0 
    ? Math.round(totalPages / finishedBooks.length) 
    : 0
  
  const longestBook = finishedBooks.reduce((max, b) => 
    (b.page_count || 0) > (max?.page_count || 0) ? b : max
  , null)

  // Genre breakdown
  const genreBreakdown = calculateGenreBreakdown(finishedBooks)
  
  // Monthly breakdown (last 6 months)
  const monthlyBreakdown = calculateMonthlyBreakdown(finishedBooks)

  // This year stats
  const thisYear = new Date().getFullYear()
  const booksThisYear = finishedBooks.filter(b => {
    if (!b.finished_at) return false
    return new Date(b.finished_at).getFullYear() === thisYear
  }).length

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Reading Statistics</h1>
        <p className={styles.subtitle}>Track your reading progress and patterns</p>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <Card variant="default">
          <div className={styles.metricCard}>
            <span className={styles.metricIcon}>📚</span>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{booksThisYear}</span>
              <span className={styles.metricLabel}>Books This Year</span>
            </div>
          </div>
        </Card>

        <Card variant="default">
          <div className={styles.metricCard}>
            <span className={styles.metricIcon}>✓</span>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{finishedBooks.length}</span>
              <span className={styles.metricLabel}>Total Finished</span>
            </div>
          </div>
        </Card>

        <Card variant="default">
          <div className={styles.metricCard}>
            <span className={styles.metricIcon}>📖</span>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{currentlyReading.length}</span>
              <span className={styles.metricLabel}>Currently Reading</span>
            </div>
          </div>
        </Card>

        <Card variant="default">
          <div className={styles.metricCard}>
            <span className={styles.metricIcon}>📄</span>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{totalPages.toLocaleString()}</span>
              <span className={styles.metricLabel}>Pages Read</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        {/* Genre Breakdown */}
        <Card variant="default">
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Reading by Genre</h2>
            {genreBreakdown.length > 0 ? (
              <div className={styles.genreList}>
                {genreBreakdown.map((item, index) => (
                  <div key={index} className={styles.genreItem}>
                    <div className={styles.genreInfo}>
                      <span className={styles.genreName}>{item.genre}</span>
                      <span className={styles.genreCount}>{item.count} books</span>
                    </div>
                    <div className={styles.genreBar}>
                      <div 
                        className={styles.genreBarFill}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyMessage}>
                No genre data yet. Finish some books to see stats!
              </p>
            )}
          </div>
        </Card>

        {/* Monthly Breakdown */}
        <Card variant="default">
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Books Per Month</h2>
            {monthlyBreakdown.length > 0 ? (
              <div className={styles.monthlyChart}>
                {monthlyBreakdown.map((item, index) => (
                  <div key={index} className={styles.monthBar}>
                    <div 
                      className={styles.monthBarFill}
                      style={{ 
                        height: `${item.count === 0 ? 5 : (item.count / Math.max(...monthlyBreakdown.map(m => m.count))) * 100}%` 
                      }}
                    >
                      {item.count > 0 && (
                        <span className={styles.monthCount}>{item.count}</span>
                      )}
                    </div>
                    <span className={styles.monthLabel}>{item.month}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyMessage}>No monthly data yet.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className={styles.additionalStats}>
        <Card variant="default">
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Average Book Length</span>
              <span className={styles.statValue}>{averagePages} pages</span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Longest Book</span>
              <span className={styles.statValue}>
                {longestBook ? `${longestBook.page_count} pages` : 'N/A'}
              </span>
              {longestBook && (
                <span className={styles.statSubtext}>{longestBook.title}</span>
              )}
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Want to Read</span>
              <span className={styles.statValue}>{wantToRead.length} books</span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Books</span>
              <span className={styles.statValue}>{books.length}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Helper functions
function calculateGenreBreakdown(books) {
  const genreCounts = {}
  
  books.forEach(book => {
    const genre = book.genre || 'Uncategorized'
    genreCounts[genre] = (genreCounts[genre] || 0) + 1
  })

  const total = books.length
  return Object.entries(genreCounts)
    .map(([genre, count]) => ({
      genre,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Top 5 genres
}

function calculateMonthlyBreakdown(books) {
  const monthCounts = {}
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  books.forEach(book => {
    if (book.finished_at) {
      const date = new Date(book.finished_at)
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1
    }
  })

  // Get last 6 months
  const result = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    result.push({
      month: months[date.getMonth()],
      count: monthCounts[monthKey] || 0
    })
  }

  return result
}