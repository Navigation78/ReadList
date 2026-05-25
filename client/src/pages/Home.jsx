import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Loading from '../components/common/Loading'
import styles from './Home.module.css'
import { BookOpen, CheckCircle, Library, ChevronRight, ChevronDown, Plus } from 'lucide-react'

const STATUS_TABS = [
  { key: 'currently_reading', label: 'In Progress' },
  { key: 'want_to_read',      label: 'Want to Read' },
  { key: null,                label: 'All' },
]

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [allBooks, setAllBooks] = useState([])
  const [activeTab, setActiveTab] = useState('currently_reading')
  const [stats, setStats] = useState({ total: 0, finished: 0, reading: 0 })
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    inProgress: true,
    wantToRead: true,
    finished: false,
  })

  useEffect(() => {
    if (!user) return
    async function load() {
      try {
        setLoading(true)
        const books = await bookService.getBooks(user.id)
        setAllBooks(books)
        setStats({
          total: books.length,
          finished: books.filter(b => b.status === 'finished').length,
          reading: books.filter(b => b.status === 'currently_reading').length,
        })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const toggle = (key) =>
    setExpandedSections(s => ({ ...s, [key]: !s[key] }))

  const filtered =
    activeTab === null
      ? allBooks
      : allBooks.filter(b => b.status === activeTab)

  const inProgress  = allBooks.filter(b => b.status === 'currently_reading')
  const wantToRead  = allBooks.filter(b => b.status === 'want_to_read')
  const finished    = allBooks.filter(b => b.status === 'finished')

  const today = new Date()
  const monthName = today.toLocaleString('default', { month: 'long' })
  const year = today.getFullYear()
  const dayOfWeek = today.toLocaleString('default', { weekday: 'long' })
  const dateStr = today.getDate()

  if (loading) return <Loading text="Loading your dashboard…" />

  return (
    <div className={styles.page}>
      {/* ── Left panel (Planner) ── */}
      <section className={styles.plannerPanel}>
        <h2 className={styles.panelTitle}>My Reading</h2>

        {/* Filter tabs */}
        <div className={styles.tabs}>
          {STATUS_TABS.map(tab => (
            <button
              key={String(tab.key)}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.key === 'currently_reading' && <BookOpen size={15} />}
              {tab.key === 'want_to_read'      && <Library  size={15} />}
              {tab.key === null                && <CheckCircle size={15} />}
              {tab.label}
              {tab.key === 'currently_reading' && inProgress.length > 0 && (
                <span className={styles.badge}>{inProgress.length}</span>
              )}
              {tab.key === 'want_to_read' && wantToRead.length > 0 && (
                <span className={styles.badge}>{wantToRead.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Stats row */}
        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <span className={styles.statNum}>{stats.reading}</span>
            <span className={styles.statLbl}>Reading</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBox}>
            <span className={styles.statNum}>{stats.finished}</span>
            <span className={styles.statLbl}>Finished</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBox}>
            <span className={styles.statNum}>{stats.total}</span>
            <span className={styles.statLbl}>Total</span>
          </div>
        </div>

        {/* Date card */}
        <div className={styles.dateCard}>
          <div className={styles.dateCardInner}>
            <p className={styles.dateTime}>
              {dayOfWeek}, {monthName} {dateStr}
            </p>
            <p className={styles.dateYear}>{year}</p>
          </div>
        </div>

        {/* Book list for active tab */}
        <div className={styles.bookList}>
          {filtered.length === 0 ? (
            <div className={styles.emptyTab}>
              <p>No books here yet.</p>
              <button
                className={styles.addBtn}
                onClick={() => navigate('/search')}
              >
                <Plus size={14} /> Find a book
              </button>
            </div>
          ) : (
            filtered.slice(0, 5).map(book => (
              <div
                key={book.id}
                className={styles.bookRow}
                onClick={() => navigate('/library')}
              >
                <div className={styles.bookCoverThumb}>
                  {book.cover_url
                    ? <img src={book.cover_url} alt={book.title} />
                    : <BookOpen size={16} />
                  }
                </div>
                <div className={styles.bookMeta}>
                  <span className={styles.bookRowTitle}>{book.title}</span>
                  <span className={styles.bookRowAuthor}>{book.author}</span>
                </div>
                {book.page_count && book.current_page != null && (
                  <div className={styles.miniProgress}>
                    <div
                      className={styles.miniBar}
                      style={{ width: `${Math.min(100, (book.current_page / book.page_count) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── Right panel (Queue / Todo-style) ── */}
      <section className={styles.queuePanel}>
        <div className={styles.queueHeader}>
          <h2 className={styles.panelTitle}>Reading Queue</h2>
          <button
            className={styles.addBookBtn}
            onClick={() => navigate('/search')}
          >
            <Plus size={14} /> Add book
          </button>
        </div>

        <p className={styles.queueSub}>Track · Organise · Discover</p>

        {/* In Progress section */}
        <div className={styles.queueSection}>
          <button
            className={styles.sectionToggle}
            onClick={() => toggle('inProgress')}
          >
            {expandedSections.inProgress
              ? <ChevronDown size={14} />
              : <ChevronRight size={14} />
            }
            <span>In Progress</span>
            <span className={styles.sectionCount}>{inProgress.length}</span>
          </button>

          {expandedSections.inProgress && inProgress.map(book => (
            <div key={book.id} className={styles.queueItem}>
              <BookOpen size={14} className={styles.queueItemIcon} />
              <span className={styles.queueItemTitle}>{book.title}</span>
              {book.author && (
                <span className={styles.queueItemAuthor}>{book.author}</span>
              )}
            </div>
          ))}
        </div>

        {/* Want to Read section */}
        <div className={styles.queueSection}>
          <button
            className={styles.sectionToggle}
            onClick={() => toggle('wantToRead')}
          >
            {expandedSections.wantToRead
              ? <ChevronDown size={14} />
              : <ChevronRight size={14} />
            }
            <span>Want to Read</span>
            <span className={styles.sectionCount}>{wantToRead.length}</span>
          </button>

          {expandedSections.wantToRead && wantToRead.map(book => (
            <div key={book.id} className={styles.queueItem}>
              <Library size={14} className={styles.queueItemIcon} />
              <span className={styles.queueItemTitle}>{book.title}</span>
              {book.author && (
                <span className={styles.queueItemAuthor}>{book.author}</span>
              )}
            </div>
          ))}
        </div>

        {/* Finished section */}
        <div className={styles.queueSection}>
          <button
            className={styles.sectionToggle}
            onClick={() => toggle('finished')}
          >
            {expandedSections.finished
              ? <ChevronDown size={14} />
              : <ChevronRight size={14} />
            }
            <span>Finished</span>
            <span className={styles.sectionCount}>{finished.length}</span>
          </button>

          {expandedSections.finished && finished.map(book => (
            <div key={book.id} className={`${styles.queueItem} ${styles.queueItemDone}`}>
              <CheckCircle size={14} className={styles.queueItemIcon} />
              <span className={styles.queueItemTitle}>{book.title}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
