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
    'bg-mint-400/40 hover:bg-mint-400/60',
    'bg-lavender-400/60 hover:bg-lavender-400/80',
    'bg-rose-200/50 hover:bg-rose-200/70',
    'bg-lavender-400/60 hover:bg-lavender-400/80',
    'bg-rose-500 hover:opacity-90',
    'bg-mint-400/40 hover:bg-mint-400/60'
  ]

  return (
    <div className="px-6 pb-10 max-w-6xl mx-auto space-y-8">
      {/* Welcome Header with Decorative Background */}
      <section className="relative py-10 mt-4 rounded-xl overflow-hidden">
        <div className="absolute inset-0 floral-pattern"></div>
        <div className="relative z-10 px-6">
          <h3 className="text-display-lg text-stone-900 animate-fade-in">
            Welcome, {displayName} <span className="text-rose-500">✨</span>
          </h3>
          <p className="text-body-lg text-stone-500 mt-2">
            Magic awaits on every page. You've reached {booksThisYear} milestone{booksThisYear === 1 ? '' : 's'} this year.
          </p>
        </div>
      </section>

      {/* Row 1: Statistics Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stars Collected Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col justify-between floating-card border border-rose-500/10">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-label-md text-stone-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-rose-500 scale-75">stars</span> Stars Collected
              </p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-display-lg text-rose-500">{finished.length}</span>
                <span className="text-label-sm text-mint-700 flex items-center bg-mint-100 px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> {booksThisYear} this year
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/stats')}
              className="text-label-md text-rose-500 underline underline-offset-4 hover:opacity-70 transition-opacity"
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
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-stone-800 text-white text-[10px] px-2 py-0.5 rounded shadow z-10 whitespace-nowrap">
                      {m.count} {m.count === 1 ? 'book' : 'books'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-4 text-label-sm text-stone-500 px-1 font-bold">
            {monthlyData.map((m, i) => (
              <span key={i}>{m.month}</span>
            ))}
          </div>
        </div>

        {/* Garden Status Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row gap-6 items-center floating-card border border-rose-500/10">
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
              <span className="text-headline-md text-stone-800">{allBooks.length}</span>
              <span className="text-label-sm text-stone-500">Seeds</span>
            </div>
          </div>
          <div className="flex-1 space-y-4 w-full">
            <div className="flex justify-between items-center">
              <h4 className="text-headline-md text-stone-800">Garden Status</h4>
              <button
                onClick={() => navigate('/library')}
                className="text-label-md text-rose-500 underline underline-offset-4"
              >
                Explore
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="text-label-md flex-1">Bloomed</span>
                <span className="text-label-md text-stone-500">{finishedPct}%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-mint-400"></div>
                <span className="text-label-md flex-1">Growing</span>
                <span className="text-label-md text-stone-500">{readingPct}%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-lavender-400"></div>
                <span className="text-label-md flex-1">Planter Box</span>
                <span className="text-label-md text-stone-500">{wantPct}%</span>
              </div>
            </div>
            <div className="bg-stone-50 px-4 py-2 rounded-full mt-4 border border-rose-500/20">
              <p className="text-label-sm text-stone-500 italic flex items-center gap-2">
                <span className="material-symbols-outlined scale-75 text-rose-500">local_florist</span> Tending to {inProgress.length} stories
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Row 2: Reading Progress & Lists */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Progress (Active Spells) */}
        <div className="bg-white rounded-xl shadow-sm p-6 col-span-1 floating-card border border-rose-500/10 flex flex-col justify-between">
          <div>
            <h4 className="text-headline-md mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-500">auto_fix_high</span> Active Spells
            </h4>
            <div className="space-y-6 py-4">
              {inProgress.length === 0 ? (
                <div className="text-center py-8 text-stone-500">
                  <span className="material-symbols-outlined text-4xl text-rose-300 mb-2">auto_stories</span>
                  <p className="text-label-md">No books in progress</p>
                </div>
              ) : (
                inProgress.slice(0, 3).map((book, i) => {
                  const pct = book.page_count > 0 && book.current_page != null
                    ? Math.round((book.current_page / book.page_count) * 100)
                    : 0
                  
                  const themes = [
                    { stroke: '#f8c8dc', text: 'text-rose-500' },
                    { stroke: '#c1dcc6', text: 'text-mint-700' },
                    { stroke: '#e1e1f5', text: 'text-lavender-700' }
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
                        <p className="text-body-md font-bold text-stone-800 leading-tight group-hover:text-rose-500 transition-colors truncate">
                          {book.title}
                        </p>
                        <p className="text-label-sm text-stone-500 truncate">
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
        <div className="bg-white rounded-xl shadow-sm p-6 col-span-1 flex flex-col justify-between floating-card border border-rose-500/10">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-headline-md">Current Journeys</h4>
              <button
                onClick={() => navigate('/search')}
                className="p-3 bg-rose-500 text-white rounded-full hover:shadow-md active:scale-90 transition-all flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {inProgress.length === 0 ? (
                <div className="text-center py-12 text-stone-500">
                  <span className="material-symbols-outlined text-4xl text-mint-700 mb-2">explore</span>
                  <p className="text-label-md">Nothing in progress yet</p>
                </div>
              ) : (
                inProgress.map((book, i) => {
                  const pct = book.page_count > 0 && book.current_page != null
                    ? Math.round((book.current_page / book.page_count) * 100)
                    : 0

                  const rowThemes = [
                    { hover: 'hover:bg-rose-500/20', bar: 'bg-rose-500', text: 'text-rose-500' },
                    { hover: 'hover:bg-mint-400/20', bar: 'bg-mint-400', text: 'text-mint-700' },
                    { hover: 'hover:bg-lavender-400/40', bar: 'bg-lavender-400', text: 'text-lavender-700' }
                  ]
                  const theme = rowThemes[i % rowThemes.length]

                  return (
                    <div
                      key={book.id}
                      onClick={() => navigate(`/book/${book.id}`)}
                      className={`flex gap-4 p-3 rounded-3xl transition-colors cursor-pointer group ${theme.hover}`}
                    >
                      <div className="w-14 h-20 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center">
                        {book.cover_url ? (
                          <img className="w-full h-full object-cover" src={book.cover_url} alt={book.title} />
                        ) : (
                          <span className="material-symbols-outlined text-3xl text-stone-500">book</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-label-md font-bold truncate">{book.title}</p>
                        <p className="text-label-sm text-stone-500 truncate">{book.author || 'Unknown'}</p>
                        <div className="w-full bg-stone-100 h-2 rounded-full mt-3 overflow-hidden">
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
        <div className="bg-white rounded-xl shadow-sm p-6 col-span-1 flex flex-col justify-between floating-card border border-rose-500/10">
          <div>
            <h4 className="text-headline-md mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-500">favorite</span> Wishlist
            </h4>
            <div className="space-y-1 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
              {wantToRead.length === 0 ? (
                <div className="text-center py-12 text-stone-500">
                  <span className="material-symbols-outlined text-4xl text-lavender-700 mb-2">favorite_border</span>
                  <p className="text-label-md">Nothing on your list yet</p>
                </div>
              ) : (
                wantToRead.slice(0, 5).map(book => (
                  <div
                    key={book.id}
                    onClick={() => navigate(`/book/${book.id}`)}
                    className="flex items-center justify-between p-4 rounded-full hover:bg-rose-500/10 transition-all group cursor-pointer"
                  >
                    <span className="text-label-md font-bold truncate pr-4">{book.title}</span>
                    <span className="material-symbols-outlined text-rose-500 group-hover:translate-x-1 transition-transform">
                      arrow_forward_ios
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-rose-500/20">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-label-sm text-stone-500">Collection Total</p>
                <p className="text-display-lg text-rose-500">{allBooks.length}</p>
              </div>
              <div className="pb-1">
                <span className="inline-flex items-center bg-rose-500/20 text-rose-500 px-4 py-2 rounded-full text-label-sm font-bold animate-pulse">
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
