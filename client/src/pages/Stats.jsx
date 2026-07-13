import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Loading from '../components/common/Loading'
import {
  BookMarked, CheckCircle, BookOpen, FileText,
  TrendingUp, Clock, Star, BarChart3
} from 'lucide-react'

const BAR_COLORS = [
  { bg: 'bg-[#f8c8dc]/20 dark:bg-[#f8c8dc]/10', bgHover: 'group-hover:bg-[#f8c8dc] dark:group-hover:bg-[#f8c8dc]/70' },
  { bg: 'bg-[#e1e1f5]/40 dark:bg-[#e1e1f5]/10', bgHover: 'group-hover:bg-[#e1e1f5] dark:group-hover:bg-[#e1e1f5]/70' },
  { bg: 'bg-[#c1dcc6]/40 dark:bg-[#c1dcc6]/10', bgHover: 'group-hover:bg-[#c1dcc6] dark:group-hover:bg-[#c1dcc6]/70' },
]

const GENRE_COLORS = ['bg-[#795465]', 'bg-[#4c6452]', 'bg-[#5c5d6e]', 'bg-[#e9bacd]', 'bg-[#d2c3c7]']

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
    return (
      <div className="relative min-h-screen bg-[#faf9f8] dark:bg-stone-950 flex items-center justify-center">
        <Loading text="Loading statistics..." />
      </div>
    )
  }

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
    {
      icon: BookMarked, label: 'Books This Year', value: booksThisYear,
      bg: 'bg-[#f8c8dc]/40 dark:bg-[#795465]/20',
      glow: 'shadow-[0_10px_40px_-10px_rgba(248,200,220,0.6)] dark:shadow-none',
      text: 'text-[#795465] dark:text-[#f8c8dc]',
      textOn: 'text-[#765162] dark:text-[#f8c8dc]/70',
    },
    {
      icon: CheckCircle, label: 'Total Finished', value: finishedBooks.length,
      bg: 'bg-[#e1e1f5]/40 dark:bg-[#5c5d6e]/20',
      glow: 'shadow-[0_10px_40px_-10px_rgba(225,225,245,0.6)] dark:shadow-none',
      text: 'text-[#5c5d6e] dark:text-[#e1e1f5]',
      textOn: 'text-[#626374] dark:text-[#e1e1f5]/70',
    },
    {
      icon: BookOpen, label: 'Reading Now', value: currentlyReading.length,
      bg: 'bg-[#c1dcc6]/40 dark:bg-[#4c6452]/20',
      glow: 'shadow-[0_10px_40px_-10px_rgba(193,220,198,0.6)] dark:shadow-none',
      text: 'text-[#4c6452] dark:text-[#c1dcc6]',
      textOn: 'text-[#4a6150] dark:text-[#c1dcc6]/70',
    },
    {
      icon: FileText, label: 'Pages Read', value: totalPages.toLocaleString(),
      bg: 'bg-[#ffd8e7]/40 dark:bg-[#795465]/20',
      glow: 'shadow-[0_10px_40px_-10px_rgba(248,200,220,0.6)] dark:shadow-none',
      text: 'text-[#795465] dark:text-[#f8c8dc]',
      textOn: 'text-[#765162] dark:text-[#f8c8dc]/70',
    },
  ]

  const details = [
    {
      icon: Clock, label: 'Avg pages per book', value: averagePages,
      accent: 'border-[#f8c8dc] dark:border-[#f8c8dc]/30',
      iconBg: 'bg-[#f8c8dc]/30 dark:bg-[#795465]/25',
      iconText: 'text-[#795465] dark:text-[#f8c8dc]',
    },
    {
      icon: Star,
      label: longestBook ? `Longest: ${longestBook.title.substring(0, 20)}${longestBook.title.length > 20 ? '…' : ''}` : 'Longest book',
      value: longestBook ? longestBook.page_count : '—',
      accent: 'border-[#e1e1f5] dark:border-[#e1e1f5]/30',
      iconBg: 'bg-[#e1e1f5]/40 dark:bg-[#5c5d6e]/25',
      iconText: 'text-[#5c5d6e] dark:text-[#e1e1f5]',
    },
    {
      icon: BookMarked, label: 'Want to read', value: wantToRead.length,
      accent: 'border-[#c1dcc6] dark:border-[#c1dcc6]/30',
      iconBg: 'bg-[#c1dcc6]/40 dark:bg-[#4c6452]/25',
      iconText: 'text-[#4c6452] dark:text-[#c1dcc6]',
    },
    {
      icon: FileText, label: 'Total in library', value: books.length,
      accent: 'border-[#f8c8dc] dark:border-[#f8c8dc]/30',
      iconBg: 'bg-[#f8c8dc]/30 dark:bg-[#795465]/25',
      iconText: 'text-[#795465] dark:text-[#f8c8dc]',
    },
  ]

  return (
    <div className="relative min-h-screen bg-[#faf9f8] dark:bg-stone-950 px-6 py-10 md:px-12 overflow-hidden">
      {/* Whimsical background glow */}
      <div
        className="fixed inset-0 -z-10 opacity-40 dark:opacity-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 10% 20%, rgba(248,200,220,0.3) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(225,225,245,0.3) 0%, transparent 20%), radial-gradient(circle at 50% 50%, rgba(193,220,198,0.2) 0%, transparent 40%)',
        }}
      />

      {/* Header */}
      <header className="relative max-w-6xl mx-auto mb-12">
        <h1 className="font-['Quicksand'] font-bold text-4xl md:text-5xl text-[#795465] dark:text-[#f8c8dc] mb-2">
          Reading Stats
        </h1>
        <p className="font-['Be_Vietnam_Pro'] text-lg text-[#4f4448] dark:text-stone-300 max-w-2xl">
          Tracking your reading journey through stories and knowledge.
        </p>
      </header>

      {/* Key Metrics */}
      <section className="relative max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {metrics.map(({ icon: Icon, label, value, bg, glow, text, textOn }) => (
          <div
            key={label}
            className={`${bg} ${glow} rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300`}
          >
            <div className={`w-12 h-12 rounded-full bg-white/80 dark:bg-stone-800/80 mb-4 flex items-center justify-center ${text}`}>
              <Icon size={20} />
            </div>
            <span className={`font-['Be_Vietnam_Pro'] text-xs font-semibold uppercase tracking-widest ${textOn}`}>
              {label}
            </span>
            <span className={`font-['Quicksand'] font-bold text-3xl mt-1 ${text}`}>{value}</span>
          </div>
        ))}
      </section>

      {/* Charts */}
      <section className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
        {/* Books Per Month */}
        <div className="lg:col-span-8 bg-white dark:bg-stone-900 rounded-2xl p-8 shadow-[0_10px_40px_-10px_rgba(225,225,245,0.6)] dark:shadow-none dark:border dark:border-stone-800 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-['Quicksand'] font-semibold text-xl text-[#5c5d6e] dark:text-[#e1e1f5]">Books Per Month</h2>
            <TrendingUp size={18} className="text-[#5c5d6e]/60 dark:text-[#e1e1f5]/60" />
          </div>

          {monthlyBreakdown.some(m => m.count > 0) ? (
            <div className="h-56 flex items-end justify-between gap-2 px-2">
              {monthlyBreakdown.map((item, index) => {
                const color = BAR_COLORS[index % BAR_COLORS.length]
                const heightPct = (item.count / maxMonthCount) * 100
                return (
                  <div key={index} className="flex-1 group flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full h-full flex items-end">
                      <div
                        className={`w-full ${color.bg} ${color.bgHover} rounded-t-full transition-all duration-500 flex items-start justify-center pt-1`}
                        style={{ height: `${heightPct}%` }}
                      >
                        {item.count > 0 && (
                          <span className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#4f4448] dark:text-stone-100">
                            {item.count}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-['Be_Vietnam_Pro'] text-xs text-[#4f4448] dark:text-stone-300">{item.month}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-12 text-[#4f4448] dark:text-stone-300">
              <TrendingUp size={32} />
              <p className="font-['Be_Vietnam_Pro'] text-sm">No monthly data yet</p>
            </div>
          )}

          <BarChart3 size={40} className="absolute bottom-4 right-4 text-[#e1e1f5] dark:text-stone-700 opacity-20 dark:opacity-40" />
        </div>

        {/* Genre Breakdown */}
        <div className="lg:col-span-4 bg-white dark:bg-stone-900 rounded-2xl p-8 shadow-[0_10px_40px_-10px_rgba(193,220,198,0.6)] dark:shadow-none dark:border dark:border-stone-800">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-['Quicksand'] font-semibold text-xl text-[#4c6452] dark:text-[#c1dcc6]">Genre Breakdown</h2>
            <BarChart3 size={18} className="text-[#4c6452]/60 dark:text-[#c1dcc6]/60" />
          </div>

          {genreBreakdown.length > 0 ? (
            <div className="space-y-6">
              {genreBreakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2 font-['Be_Vietnam_Pro'] text-sm">
                    <span className="text-[#1a1c1c] dark:text-stone-100">{item.genre}</span>
                    <span className="text-[#4f4448] dark:text-stone-300">{item.count} {item.count === 1 ? 'book' : 'books'}</span>
                  </div>
                  <div className="w-full bg-[#eeeeed] dark:bg-stone-800 h-3 rounded-full overflow-hidden">
                    <div
                      className={`${GENRE_COLORS[index % GENRE_COLORS.length]} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-12 text-[#4f4448] dark:text-stone-300">
              <BarChart3 size={32} />
              <p className="font-['Be_Vietnam_Pro'] text-sm text-center">Finish some books to see genre stats</p>
            </div>
          )}
        </div>
      </section>

      {/* More Details */}
      <section className="relative max-w-6xl mx-auto">
        <h2 className="font-['Quicksand'] font-semibold text-xl text-[#795465] dark:text-[#f8c8dc] mb-6 flex items-center gap-2">
          More Details
          <Star size={18} className="text-[#f8c8dc]" />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {details.map(({ icon: Icon, label, value, accent, iconBg, iconText }) => (
            <div
              key={label}
              className={`bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm dark:shadow-none flex gap-4 items-center border-l-4 ${accent}`}
            >
              <div className={`${iconBg} p-3 rounded-full ${iconText}`}>
                <Icon size={16} />
              </div>
              <div>
                <p className="font-['Quicksand'] font-bold text-xl text-[#1a1c1c] dark:text-stone-100">{value}</p>
                <p className="font-['Be_Vietnam_Pro'] text-xs text-[#4f4448] dark:text-stone-300">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
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