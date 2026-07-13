import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Loading from '../components/common/Loading'

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

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Reader'

  // Bar chart data: last 6 months finished books
  const monthlyData = getMonthlyData(finished)
  const maxVal = Math.max(...monthlyData.map(m => m.count), 1)

  // Status donut segments (simple percentages)
  const total = allBooks.length || 1
  const readingPct  = Math.round((inProgress.length / total) * 100)
  const finishedPct = Math.round((finished.length  / total) * 100)
  const wantPct     = 100 - readingPct - finishedPct

  const barColors = [
    'bg-mint/40 hover:bg-mint/60',
    'bg-lavender/60 hover:bg-lavender/80',
    'bg-peach/50 hover:bg-peach/70',
    'bg-lavender/60 hover:bg-lavender/80',
    'bg-primary-container hover:opacity-90',
    'bg-mint/40 hover:bg-mint/60'
  ]

  return (
    <div className="px-container-margin pb-section-gap max-w-container-max mx-auto space-y-gutter">
      {/* Welcome Header with Decorative Background */}
      <section className="relative py-stack-lg mt-stack-md rounded-xl overflow-hidden">
        <div className="absolute inset-0 floral-pattern"></div>
        <div className="relative z-10 px-stack-md">
          <h3 className="text-display-lg font-display-lg text-on-background animate-fade-in">
            Welcome, {displayName} <span className="text-primary">✨</span>
          </h3>
          <p className="text-body-lg font-body-lg text-on-surface-variant mt-2">
            Magic awaits on every page. You've reached {booksThisYear} milestone{booksThisYear === 1 ? '' : 's'} this year.
          </p>
        </div>
      </section>

      {/* Row 1: Statistics Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {/* Stars Collected Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-stack-md flex flex-col justify-between floating-card border border-primary-container/10">
          <div className="flex justify-between items-start mb-stack-sm">
            <div>
              <p className="text-label-md font-label-md text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-primary scale-75">stars</span> Stars Collected
              </p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-display-lg font-display-lg text-primary">{finished.length}</span>
                <span className="text-label-sm font-label-sm text-tertiary flex items-center bg-tertiary-container px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> {booksThisYear} this year
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/stats')}
              className="text-label-md font-label-md text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              View Stats
            </button>
          </div>
          
          {/* Bar Chart */}
          <div className="h-40 flex items-end justify-between gap-3 mt-4 px-2">
            {monthlyData.map((m, i) => {
              const heightPercent = Math.max(10, (m.count / maxVal) * 100)
              const colorClass = barColors[i % barColors.length]
              return (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div
                    className={`${colorClass} rounded-t-full w-full transition-all duration-300 relative`}
                    style={{ height: `${heightPercent}%` }}
                    title={`${m.count} books finished`}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-on-surface text-surface text-[10px] px-2 py-0.5 rounded shadow z-10 whitespace-nowrap">
                      {m.count} {m.count === 1 ? 'book' : 'books'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-4 text-label-sm text-on-surface-variant px-1 font-bold">
            {monthlyData.map((m, i) => (
              <span key={i}>{m.month}</span>
            ))}
          </div>
        </div>

        {/* Garden Status Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-stack-md flex flex-col md:flex-row gap-stack-md items-center floating-card border border-primary-container/10">
          <div className="relative w-48 h-48 flex-shrink-0">
            {/* SVG Donut Chart with Pastel Colors */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#f4f3f2" strokeWidth="4"></circle>
              {finishedPct > 0 && (
                <circle
                  cx="18"
                  cy="18"
                  fill="transparent"
                  r="16"
                  stroke="#f8c8dc"
                  strokeWidth="4"
                  strokeDasharray={`${finishedPct}, ${100 - finishedPct}`}
                  strokeDashoffset="0"
                ></circle>
              )}
              {readingPct > 0 && (
                <circle
                  cx="18"
                  cy="18"
                  fill="transparent"
                  r="16"
                  stroke="#c1dcc6"
                  strokeWidth="4"
                  strokeDasharray={`${readingPct}, ${100 - readingPct}`}
                  strokeDashoffset={-finishedPct}
                ></circle>
              )}
              {wantPct > 0 && (
                <circle
                  cx="18"
                  cy="18"
                  fill="transparent"
                  r="16"
                  stroke="#e1e1f5"
                  strokeWidth="4"
                  strokeDasharray={`${wantPct}, ${100 - wantPct}`}
                  strokeDashoffset={-(finishedPct + readingPct)}
                ></circle>
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-headline-md font-headline-md text-on-surface">{allBooks.length}</span>
              <span className="text-label-sm font-label-sm text-on-surface-variant">Seeds</span>
            </div>
          </div>
          <div className="flex-1 space-y-4 w-full">
            <div className="flex justify-between items-center">
              <h4 className="text-headline-md font-headline-md text-on-surface">Garden Status</h4>
              <button
                onClick={() => navigate('/library')}
                className="text-label-md font-label-md text-primary underline underline-offset-4"
              >
                Explore
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary-container"></div>
                <span className="text-label-md font-label-md flex-1">Bloomed</span>
                <span className="text-label-md font-label-md text-on-surface-variant">{finishedPct}%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-mint"></div>
                <span className="text-label-md font-label-md flex-1">Growing</span>
                <span className="text-label-md font-label-md text-on-surface-variant">{readingPct}%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-lavender"></div>
                <span className="text-label-md font-label-md flex-1">Planter Box</span>
                <span className="text-label-md font-label-md text-on-surface-variant">{wantPct}%</span>
              </div>
            </div>
            <div className="bg-surface-container-low px-4 py-2 rounded-full mt-4 border border-primary-container/20">
              <p className="text-label-sm font-label-sm text-on-surface-variant italic flex items-center gap-2">
                <span className="material-symbols-outlined scale-75 text-primary">local_florist</span> Tending to {inProgress.length} stories
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Row 2: Reading Progress & Lists */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Active Progress (Active Spells) */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-stack-md col-span-1 floating-card border border-primary-container/10 flex flex-col justify-between">
          <div>
            <h4 className="text-headline-md font-headline-md mb-stack-md flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">auto_fix_high</span> Active Spells
            </h4>
            <div className="space-y-stack-lg py-4">
              {inProgress.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl text-primary-container mb-2">auto_stories</span>
                  <p className="text-label-md">No books in progress</p>
                </div>
              ) : (
                inProgress.slice(0, 3).map((book, i) => {
                  const pct = book.page_count > 0 && book.current_page != null
                    ? Math.round((book.current_page / book.page_count) * 100)
                    : 0
                  
                  const themes = [
                    { stroke: '#f8c8dc', text: 'text-primary' },
                    { stroke: '#c1dcc6', text: 'text-tertiary' },
                    { stroke: '#e1e1f5', text: 'text-secondary' }
                  ]
                  const theme = themes[i % themes.length]

                  return (
                    <div
                      key={book.id}
                      onClick={() => navigate(`/book/${book.id}`)}
                      className="flex items-center gap-4 group cursor-pointer"
                    >
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" fill="transparent" r="16" stroke="#f4f3f2" strokeWidth="3"></circle>
                          <circle
                            cx="18"
                            cy="18"
                            fill="transparent"
                            r="16"
                            stroke={theme.stroke}
                            strokeWidth="3"
                            strokeDasharray={`${pct}, ${100 - pct}`}
                            strokeLinecap="round"
                          ></circle>
                        </svg>
                        <div className={`absolute inset-0 flex items-center justify-center text-label-sm font-bold ${theme.text}`}>
                          {pct}%
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-body-md font-bold text-on-surface leading-tight group-hover:text-primary transition-colors truncate">
                          {book.title}
                        </p>
                        <p className="text-label-sm text-on-surface-variant truncate">
                          {book.author || 'Unknown Author'}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Reading Now List (Current Journeys) */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-stack-md col-span-1 flex flex-col justify-between floating-card border border-primary-container/10">
          <div>
            <div className="flex justify-between items-center mb-stack-md">
              <h4 className="text-headline-md font-headline-md">Current Journeys</h4>
              <button
                onClick={() => navigate('/search')}
                className="p-3 bg-primary-container text-on-primary-container rounded-full hover:shadow-md active:scale-90 transition-all flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {inProgress.length === 0 ? (
                <div className="text-center py-12 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl text-mint mb-2">explore</span>
                  <p className="text-label-md">Nothing in progress yet</p>
                </div>
              ) : (
                inProgress.map((book, i) => {
                  const pct = book.page_count > 0 && book.current_page != null
                    ? Math.round((book.current_page / book.page_count) * 100)
                    : 0

                  const rowThemes = [
                    { hover: 'hover:bg-primary-container/20', bar: 'bg-primary-container', text: 'text-primary' },
                    { hover: 'hover:bg-mint/20', bar: 'bg-mint', text: 'text-tertiary' },
                    { hover: 'hover:bg-lavender/40', bar: 'bg-lavender', text: 'text-secondary' }
                  ]
                  const theme = rowThemes[i % rowThemes.length]

                  return (
                    <div
                      key={book.id}
                      onClick={() => navigate(`/book/${book.id}`)}
                      className={`flex gap-4 p-3 rounded-3xl transition-colors cursor-pointer group ${theme.hover}`}
                    >
                      <div className="w-14 h-20 bg-surface-variant rounded-xl overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center">
                        {book.cover_url ? (
                          <img className="w-full h-full object-cover" src={book.cover_url} alt={book.title} />
                        ) : (
                          <span className="material-symbols-outlined text-3xl text-on-surface-variant">book</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-label-md font-bold truncate">{book.title}</p>
                        <p className="text-label-sm text-on-surface-variant truncate">{book.author || 'Unknown'}</p>
                        <div className="w-full bg-surface-container h-2 rounded-full mt-3 overflow-hidden">
                          <div className={`h-full rounded-full ${theme.bar}`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                      <div className={`text-label-md font-bold self-center ${theme.text}`}>{pct}%</div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Wishlist Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-stack-md col-span-1 flex flex-col justify-between floating-card border border-primary-container/10">
          <div>
            <h4 className="text-headline-md font-headline-md mb-stack-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">favorite</span> Wishlist
            </h4>
            <div className="space-y-1 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
              {wantToRead.length === 0 ? (
                <div className="text-center py-12 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl text-lavender mb-2">favorite_border</span>
                  <p className="text-label-md">Nothing on your list yet</p>
                </div>
              ) : (
                wantToRead.slice(0, 5).map(book => (
                  <div
                    key={book.id}
                    onClick={() => navigate(`/book/${book.id}`)}
                    className="flex items-center justify-between p-4 rounded-full hover:bg-primary-container/10 transition-all group cursor-pointer"
                  >
                    <span className="text-label-md font-bold truncate pr-4">{book.title}</span>
                    <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
                      arrow_forward_ios
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-stack-lg pt-stack-md border-t border-primary-container/20">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-label-sm font-label-sm text-on-surface-variant">Collection Total</p>
                <p className="text-display-lg font-display-lg text-primary">{allBooks.length}</p>
              </div>
              <div className="pb-1">
                <span className="inline-flex items-center bg-primary-container/20 text-primary px-4 py-2 rounded-full text-label-sm font-bold animate-pulse">
                  {finished.length} finished · {totalPages.toLocaleString()} pages
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
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
