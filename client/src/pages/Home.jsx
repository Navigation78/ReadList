import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Loading from '../components/common/Loading'
import styles from './Home.module.css'
import {
  BookOpen, CheckCircle, BookMarked, TrendingUp,
  Plus, ChevronRight, BarChart2
} from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [allBooks, setAllBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      try {
        setLoading(true)
        const books = await bookService.getBooks(user.id)
        setAllBooks(books)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  if (loading) return <Loading text="Loading your dashboard…" />

  const inProgress  = allBooks.filter(b => b.status === 'currently_reading')
  const wantToRead  = allBooks.filter(b => b.status === 'want_to_read')
  const finished    = allBooks.filter(b => b.status === 'finished')
  const totalPages  = finished.reduce((s, b) => s + (b.page_count || 0), 0)
  const thisYear    = new Date().getFullYear()
  const booksThisYear = finished.filter(b =>
    b.finished_at && new Date(b.finished_at).getFullYear() === thisYear
  ).length

  const today     = new Date()
  const dateLabel = today.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Reader'

  // Bar chart data: last 6 months finished books
  const monthlyData = getMonthlyData(finished)
  const maxVal = Math.max(...monthlyData.map(m => m.count), 1)

  // Status donut segments (simple percentages)
  const total = allBooks.length || 1
  const readingPct  = Math.round((inProgress.length / total) * 100)
  const finishedPct = Math.round((finished.length  / total) * 100)
  const wantPct     = 100 - readingPct - finishedPct

  return (
    <div className={styles.page}>
      {/* Page title */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
      </div>

      {/* ── Row 1 ── */}
      <div className={styles.row1}>
        {/* Books Read card (like Revenue) */}
        <div className={styles.card}>
          <div className={styles.cardTopRow}>
            <div>
              <p className={styles.cardLabel}>Books Finished</p>
              <h2 className={styles.bigStat}>{finished.length}</h2>
              <p className={styles.cardSub}>
                <span className={styles.trendUp}>
                  <TrendingUp size={13} /> {booksThisYear} this year
                </span>
              </p>
            </div>
            <button
              className={styles.viewReportBtn}
              onClick={() => navigate('/stats')}
            >
              View Stats
            </button>
          </div>
          <p className={styles.cardDateRange}>{dateLabel}</p>

          {/* Bar chart */}
          <div className={styles.barChart}>
            {monthlyData.map((m, i) => (
              <div key={i} className={styles.barCol}>
                <div className={styles.barTrack}>
                  <div
                    className={`${styles.bar} ${i === monthlyData.length - 1 ? styles.barActive : ''}`}
                    style={{ height: `${Math.max(4, (m.count / maxVal) * 100)}%` }}
                  />
                </div>
                <span className={styles.barLabel}>{m.month}</span>
              </div>
            ))}
          </div>

          <div className={styles.legendRow}>
            <span className={styles.legendDot} style={{ background: 'var(--accent-color)' }} />
            <span className={styles.legendText}>Last 6 months</span>
            <span className={styles.legendDot} style={{ background: 'var(--border-dark)' }} />
            <span className={styles.legendText}>Previous</span>
          </div>
        </div>

        {/* Reading Status donut (like Order Time) */}
        <div className={styles.card}>
          <div className={styles.cardTopRow}>
            <div>
              <p className={styles.cardLabel}>Library Status</p>
              <p className={styles.cardSub}>{allBooks.length} books total</p>
            </div>
            <button
              className={styles.viewReportBtn}
              onClick={() => navigate('/library')}
            >
              View Library
            </button>
          </div>

          {/* Donut chart (CSS-only) */}
          <div className={styles.donutWrap}>
            <div
              className={styles.donut}
              style={{
                background: `conic-gradient(
                  var(--accent-color) 0% ${finishedPct}%,
                  #D4956A ${finishedPct}% ${finishedPct + readingPct}%,
                  var(--border-dark) ${finishedPct + readingPct}% 100%
                )`
              }}
            >
              <div className={styles.donutHole}>
                <span className={styles.donutNum}>{allBooks.length}</span>
                <span className={styles.donutSub}>books</span>
              </div>
            </div>
            {/* Tooltip-style callout */}
            {inProgress.length > 0 && (
              <div className={styles.donutCallout}>
                <p className={styles.calloutTitle}>Reading Now</p>
                <p className={styles.calloutSub}>{inProgress.length} {inProgress.length === 1 ? 'book' : 'books'}</p>
              </div>
            )}
          </div>

          <div className={styles.donutLegend}>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: 'var(--accent-color)' }} /> Finished {finishedPct}%
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#D4956A' }} /> Reading {readingPct}%
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: 'var(--border-dark)' }} /> Want {wantPct}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 2 ── */}
      <div className={styles.row2}>
        {/* Progress bubbles (like Your Rating) */}
        <div className={styles.card}>
          <p className={styles.cardLabel}>Reading Progress</p>
          <p className={styles.cardSub}>Pages across active books</p>
          <div className={styles.bubblesWrap}>
            {inProgress.length === 0 ? (
              <div className={styles.emptyBubble}>
                <BookOpen size={28} />
                <p>No books in progress</p>
              </div>
            ) : (
              inProgress.slice(0, 3).map((book, i) => {
                const pct = book.page_count > 0 && book.current_page != null
                  ? Math.round((book.current_page / book.page_count) * 100)
                  : 0
                const sizes = ['large', 'medium', 'small']
                return (
                  <div
                    key={book.id}
                    className={`${styles.bubble} ${styles[`bubble_${sizes[i]}`]}`}
                    onClick={() => navigate(`/book/${book.id}`)}
                    title={book.title}
                  >
                    <span className={styles.bubblePct}>{pct}%</span>
                    <span className={styles.bubbleLabel}>{book.title.split(' ').slice(0, 2).join(' ')}</span>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Currently reading list (like Food with most requests) */}
        <div className={styles.card}>
          <div className={styles.cardTopRow}>
            <div>
              <p className={styles.cardLabel}>Currently Reading</p>
              <p className={styles.cardSub}>your active books</p>
            </div>
            <button className={styles.addBookBtn} onClick={() => navigate('/search')}>
              <Plus size={13} /> Add
            </button>
          </div>
          <div className={styles.bookList}>
            {inProgress.length === 0 ? (
              <div className={styles.emptyList}>
                <BookOpen size={22} />
                <p>Nothing in progress yet</p>
              </div>
            ) : (
              inProgress.slice(0, 5).map(book => {
                const pct = book.page_count > 0 && book.current_page != null
                  ? Math.round((book.current_page / book.page_count) * 100)
                  : null
                return (
                  <div key={book.id} className={styles.bookRow} onClick={() => navigate(`/book/${book.id}`)}>
                    <div className={styles.bookThumb}>
                      {book.cover_url
                        ? <img src={book.cover_url} alt={book.title} />
                        : <BookOpen size={14} />
                      }
                    </div>
                    <div className={styles.bookMeta}>
                      <span className={styles.bookTitle}>{book.title}</span>
                      {book.author && <span className={styles.bookAuthor}>{book.author}</span>}
                    </div>
                    {pct !== null && (
                      <span className={styles.bookPct}>{pct}%</span>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Total books + want to read (like Order card) */}
        <div className={styles.card}>
          <div className={styles.cardTopRow}>
            <div>
              <p className={styles.cardLabel}>Total Books</p>
              <h2 className={styles.bigStatSm}>{allBooks.length}</h2>
              <p className={styles.cardSub}>
                {wantToRead.length > 0 && (
                  <span className={styles.trendDown}>
                    <BarChart2 size={13} /> {wantToRead.length} want to read
                  </span>
                )}
              </p>
            </div>
            <button className={styles.viewReportBtn} onClick={() => navigate('/library')}>
              View All
            </button>
          </div>

          {/* Mini line-style list */}
          <div className={styles.wantList}>
            {wantToRead.length === 0 ? (
              <div className={styles.emptyList}>
                <BookMarked size={20} />
                <p>Nothing on your list yet</p>
              </div>
            ) : (
              wantToRead.slice(0, 4).map(book => (
                <div key={book.id} className={styles.wantRow} onClick={() => navigate(`/book/${book.id}`)}>
                  <BookMarked size={13} className={styles.wantIcon} />
                  <span className={styles.wantTitle}>{book.title}</span>
                  <ChevronRight size={12} className={styles.wantArrow} />
                </div>
              ))
            )}
          </div>

          {/* Finished stat */}
          <div className={styles.finishBadge}>
            <CheckCircle size={15} />
            <span>{finished.length} finished · {totalPages.toLocaleString()} pages read</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function getMonthlyData(finishedBooks) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const counts = {}
  finishedBooks.forEach(b => {
    if (b.finished_at) {
      const d = new Date(b.finished_at)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      counts[key] = (counts[key] || 0) + 1
    }
  })
  const result = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    result.push({ month: months[d.getMonth()], count: counts[key] || 0 })
  }
  return result
}
