import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Loading from '../components/common/Loading'
import styles from './Home.module.css'
import {
  BookOpen, CheckCircle, BookMarked, ChevronRight,
  ChevronDown, Plus, Search, TrendingUp, Library
} from 'lucide-react'

const STATUS_TABS = [
  { key: 'currently_reading', label: 'In Progress', icon: BookOpen    },
  { key: 'want_to_read',      label: 'Want to Read', icon: BookMarked },
  { key: null,                label: 'All',          icon: Library    },
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
    finished:   false,
  })

  useEffect(() => {
    if (!user) return
    async function load() {
      try {
        setLoading(true)
        const books = await bookService.getBooks(user.id)
        setAllBooks(books)
        setStats({
          total:    books.length,
          finished: books.filter(b => b.status === 'finished').length,
          reading:  books.filter(b => b.status === 'currently_reading').length,
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

  const inProgress = allBooks.filter(b => b.status === 'currently_reading')
  const wantToRead = allBooks.filter(b => b.status === 'want_to_read')
  const finished   = allBooks.filter(b => b.status === 'finished')

  const filtered =
    activeTab === null ? allBooks : allBooks.filter(b => b.status === activeTab)

  const today    = new Date()
  const monthName = today.toLocaleString('default', { month: 'long' })
  const year      = today.getFullYear()
  const dayOfWeek = today.toLocaleString('default', { weekday: 'long' })
  const dateStr   = today.getDate()

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Reader'

  if (loading) return <Loading text="Loading your dashboard…" />

  return (
    <div className={styles.page}>
      {/* ── Left panel ── */}
      <section className={styles.plannerPanel}>
        {/* Greeting */}
        <div className={styles.greeting}>
          <p className={styles.greetingLabel}>Good {getTimeOfDay()},</p>
          <h2 className={styles.greetingName}>{displayName}</h2>
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
          <p className={styles.dateTime}>{dayOfWeek}, {monthName} {dateStr}</p>
          <p className={styles.dateYear}>{year}</p>
        </div>

        {/* Filter tabs */}
        <div className={styles.tabs}>
          {STATUS_TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={String(tab.key)}
                className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <Icon size={14} />
                {tab.label}
                {tab.key === 'currently_reading' && inProgress.length > 0 && (
                  <span className={styles.badge}>{inProgress.length}</span>
                )}
                {tab.key === 'want_to_read' && wantToRead.length > 0 && (
                  <span className={styles.badge}>{wantToRead.length}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Book list for active tab */}
        <div className={styles.bookList}>
          {filtered.length === 0 ? (
            <div className={styles.emptyTab}>
              <div className={styles.emptyTabIconWrap}>
                <Search size={20} />
              </div>
              <p className={styles.emptyTabText}>No books here yet.</p>
              <button className={styles.addBtn} onClick={() => navigate('/search')}>
                <Plus size={14} /> Find a book
              </button>
            </div>
          ) : (
            filtered.slice(0, 6).map(book => (
              <div
                key={book.id}
                className={styles.bookRow}
                onClick={() => navigate(`/book/${book.id}`)}
              >
                <div className={styles.bookCoverThumb}>
                  {book.cover_url
                    ? <img src={book.cover_url} alt={book.title} />
                    : <BookOpen size={15} />
                  }
                </div>
                <div className={styles.bookMeta}>
                  <span className={styles.bookRowTitle}>{book.title}</span>
                  <span className={styles.bookRowAuthor}>{book.author}</span>
                </div>
                {book.page_count > 0 && book.current_page != null && (
                  <div className={styles.miniProgress}>
                    <div
                      className={styles.miniBar}
                      style={{ width: `${Math.min(100, (book.current_page / book.page_count) * 100)}%` }}
                    />
                  </div>
                )}
                <ChevronRight size={14} className={styles.bookRowArrow} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── Right panel (Queue) ── */}
      <section className={styles.queuePanel}>
        <div className={styles.queueHeader}>
          <div>
            <h2 className={styles.panelTitle}>Reading Queue</h2>
            <p className={styles.queueSub}>Track · Organise · Discover</p>
          </div>
          <button className={styles.addBookBtn} onClick={() => navigate('/search')}>
            <Plus size={14} /> Add book
          </button>
        </div>

        {/* Quick actions */}
        <div className={styles.quickActions}>
          <button className={styles.quickAction} onClick={() => navigate('/library')}>
            <BookMarked size={16} />
            <span>Library</span>
          </button>
          <button className={styles.quickAction} onClick={() => navigate('/stats')}>
            <TrendingUp size={16} />
            <span>Stats</span>
          </button>
          <button className={styles.quickAction} onClick={() => navigate('/search')}>
            <Search size={16} />
            <span>Search</span>
          </button>
        </div>

        {/* In Progress */}
        <div className={styles.queueSection}>
          <button className={styles.sectionToggle} onClick={() => toggle('inProgress')}>
            {expandedSections.inProgress ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <BookOpen size={14} className={styles.sectionIcon} />
            <span>In Progress</span>
            <span className={styles.sectionCount}>{inProgress.length}</span>
          </button>
          {expandedSections.inProgress && inProgress.map(book => (
            <div
              key={book.id}
              className={styles.queueItem}
              onClick={() => navigate(`/book/${book.id}`)}
            >
              <div className={styles.queueItemDot} />
              <span className={styles.queueItemTitle}>{book.title}</span>
              {book.author && <span className={styles.queueItemAuthor}>{book.author}</span>}
            </div>
          ))}
          {expandedSections.inProgress && inProgress.length === 0 && (
            <p className={styles.sectionEmpty}>Nothing in progress — <button className={styles.inlineLink} onClick={() => navigate('/search')}>find a book</button></p>
          )}
        </div>

        {/* Want to Read */}
        <div className={styles.queueSection}>
          <button className={styles.sectionToggle} onClick={() => toggle('wantToRead')}>
            {expandedSections.wantToRead ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <BookMarked size={14} className={styles.sectionIcon} />
            <span>Want to Read</span>
            <span className={styles.sectionCount}>{wantToRead.length}</span>
          </button>
          {expandedSections.wantToRead && wantToRead.map(book => (
            <div
              key={book.id}
              className={styles.queueItem}
              onClick={() => navigate(`/book/${book.id}`)}
            >
              <div className={`${styles.queueItemDot} ${styles.dotPurple}`} />
              <span className={styles.queueItemTitle}>{book.title}</span>
              {book.author && <span className={styles.queueItemAuthor}>{book.author}</span>}
            </div>
          ))}
        </div>

        {/* Finished */}
        <div className={styles.queueSection}>
          <button className={styles.sectionToggle} onClick={() => toggle('finished')}>
            {expandedSections.finished ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <CheckCircle size={14} className={styles.sectionIcon} />
            <span>Finished</span>
            <span className={styles.sectionCount}>{finished.length}</span>
          </button>
          {expandedSections.finished && finished.map(book => (
            <div
              key={book.id}
              className={`${styles.queueItem} ${styles.queueItemDone}`}
              onClick={() => navigate(`/book/${book.id}`)}
            >
              <CheckCircle size={13} className={styles.doneIcon} />
              <span className={styles.queueItemTitle}>{book.title}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
