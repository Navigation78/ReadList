import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Loading from '../components/common/Loading'
import styles from './Stats.module.css'
import {
  BookMarked, CheckCircle, BookOpen, FileText,
  TrendingUp, Clock, Star, BarChart3
} from 'lucide-react'

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

  if (loading) return <Loading text="Loading statistics..." />

  const finishedBooks    = books.filter(b => b.status === 'finished')
  const currentlyReading = books.filter(b => b.status === 'currently_reading')
  const wantToRead       = books.filter(b => b.status === 'want_to_read')

  const totalPages   = finishedBooks.reduce((sum, b) => sum + (b.page_count || 0), 0)
  const averagePages = finishedBooks.length > 0
    ? Math.round(totalPages / finishedBooks.length)
    : 0

  const longestBook = finishedBooks.reduce((max, b) =>
    (b.page_count || 0) > (max?.page_count || 0) ? b : max
  , null)

  const thisYear       = new Date().getFullYear()
  const booksThisYear  = finishedBooks.filter(b =>
    b.finished_at && new Date(b.finished_at).getFullYear() === thisYear
  ).length

  const genreBreakdown   = calculateGenreBreakdown(finishedBooks)
  const monthlyBreakdown = calculateMonthlyBreakdown(finishedBooks)

  const maxMonthCount = Math.max(...monthlyBreakdown.map(m => m.count), 1)

  const metrics = [
    { icon: BookMarked, label: 'Books This Year', value: booksThisYear,               color: 'blue'   },
    { icon: CheckCircle,label: 'Total Finished',  value: finishedBooks.length,         color: 'green'  },
    { icon: BookOpen,   label: 'Reading Now',     value: currentlyReading.length,      color: 'indigo' },
    { icon: FileText,   label: 'Pages Read',      value: totalPages.toLocaleString(),  color: 'purple' },
  ]

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Reading Stats</h1>
          <p className={styles.subtitle}>Your reading journey at a glance</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        {metrics.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={`${styles.metricCard} ${styles[`metric_${color}`]}`}>
            <div className={styles.metricIconWrap}>
              <Icon size={20} />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{value}</span>
              <span className={styles.metricLabel}>{label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        {/* Genre Breakdown */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>Genre Breakdown</h2>
            <span className={styles.chartIcon}><BarChart3 size={18} /></span>
          </div>
          {genreBreakdown.length > 0 ? (
            <div className={styles.genreList}>
              {genreBreakdown.map((item, index) => (
                <div key={index} className={styles.genreItem}>
                  <div className={styles.genreInfo}>
                    <span className={styles.genreName}>{item.genre}</span>
                    <span className={styles.genreCount}>{item.count} {item.count === 1 ? 'book' : 'books'}</span>
                  </div>
                  <div className={styles.genreBarTrack}>
                    <div
                      className={styles.genreBarFill}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyChart}>
              <BarChart3 size={32} />
              <p>Finish some books to see genre stats</p>
            </div>
          )}
        </div>

        {/* Monthly Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>Books Per Month</h2>
            <span className={styles.chartIcon}><TrendingUp size={18} /></span>
          </div>
          {monthlyBreakdown.some(m => m.count > 0) ? (
            <div className={styles.monthlyChart}>
              {monthlyBreakdown.map((item, index) => (
                <div key={index} className={styles.monthBar}>
                  <div className={styles.monthBarTrack}>
                    <div
                      className={styles.monthBarFill}
                      style={{ height: `${(item.count / maxMonthCount) * 100}%` }}
                    >
                      {item.count > 0 && (
                        <span className={styles.monthCount}>{item.count}</span>
                      )}
                    </div>
                  </div>
                  <span className={styles.monthLabel}>{item.month}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyChart}>
              <TrendingUp size={32} />
              <p>No monthly data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div className={styles.additionalCard}>
        <div className={styles.chartHeader}>
          <h2 className={styles.chartTitle}>More Details</h2>
          <span className={styles.chartIcon}><Star size={18} /></span>
        </div>
        <div className={styles.additionalGrid}>
          <div className={styles.statItem}>
            <div className={styles.statItemIcon} style={{ background: '#e8edfb', color: '#3b5bdb' }}>
              <Clock size={16} />
            </div>
            <div>
              <span className={styles.statValue}>{averagePages}</span>
              <span className={styles.statLabel}>Avg pages per book</span>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statItemIcon} style={{ background: '#d3f9d8', color: '#2f9e44' }}>
              <Star size={16} />
            </div>
            <div>
              <span className={styles.statValue}>{longestBook ? `${longestBook.page_count}` : '—'}</span>
              <span className={styles.statLabel}>
                {longestBook ? `Longest: ${longestBook.title.substring(0, 20)}${longestBook.title.length > 20 ? '…' : ''}` : 'Longest book'}
              </span>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statItemIcon} style={{ background: '#fff0f6', color: '#c2255c' }}>
              <BookMarked size={16} />
            </div>
            <div>
              <span className={styles.statValue}>{wantToRead.length}</span>
              <span className={styles.statLabel}>Want to read</span>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statItemIcon} style={{ background: '#e8edfb', color: '#3b5bdb' }}>
              <FileText size={16} />
            </div>
            <div>
              <span className={styles.statValue}>{books.length}</span>
              <span className={styles.statLabel}>Total in library</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

function calculateMonthlyBreakdown(books) {
  const monthCounts = {}
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  books.forEach(book => {
    if (book.finished_at) {
      const date = new Date(book.finished_at)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      monthCounts[key] = (monthCounts[key] || 0) + 1
    }
  })
  const result = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    result.push({ month: months[date.getMonth()], count: monthCounts[key] || 0 })
  }
  return result
}
