import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Button from '../components/common/Button'
import Loading from '../components/common/Loading'
import {
  BookOpen, BookMarked, CheckCircle, Plus, Search, TrendingUp, Clock
} from 'lucide-react'

const TABS = [
  { id: 'currently_reading', label: 'Reading', icon: BookOpen },
  { id: 'want_to_read', label: 'Want to Read', icon: BookMarked },
  { id: 'finished', label: 'Finished', icon: CheckCircle },
]

export default function Library() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('currently_reading')
  const [books, setBooks] = useState({
    want_to_read: [],
    currently_reading: [],
    finished: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function loadBooks() {
      try {
        setLoading(true)
        const allBooks = await bookService.getBooks(user.id)
        setBooks({
          want_to_read: allBooks.filter(b => b.status === 'want_to_read'),
          currently_reading: allBooks.filter(b => b.status === 'currently_reading'),
          finished: allBooks.filter(b => b.status === 'finished'),
        })
      } catch (error) {
        console.error('Error loading books:', error)
      } finally {
        setLoading(false)
      }
    }
    loadBooks()
  }, [user])

  const currentBooks = books[activeTab]
  const total = Object.values(books).flat().length

  if (loading) return <Loading text="Loading your library..." />

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-rose-500">My Library</h1>
          <p className="text-stone-500 mt-1">{total} {total === 1 ? 'book' : 'books'} in your collection</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/search')}>
          <Plus size={16} /> Add Book
        </Button>
      </div>

      {/* tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition ${
              activeTab === id
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white text-stone-500 border border-stone-200 hover:border-rose-200 hover:text-rose-500'
            }`}
          >
            <Icon size={15} />
            {label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === id ? 'bg-white/20' : 'bg-stone-100'}`}>
              {books[id].length}
            </span>
          </button>
        ))}
      </div>

      {/* content */}
      {currentBooks.length === 0 ? (
        <div className="flex flex-col items-center text-center gap-4 bg-white rounded-3xl py-20 px-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">
            <Search size={28} />
          </div>
          <h3 className="font-display text-xl font-semibold text-stone-800">No books here yet</h3>
          <p className="text-stone-500 max-w-sm">
            {activeTab === 'currently_reading' && 'Start reading a book to track your progress here.'}
            {activeTab === 'want_to_read' && 'Add books you want to read to build your reading list.'}
            {activeTab === 'finished' && "Finish a book and it'll show up here."}
          </p>
          <Button variant="primary" onClick={() => navigate('/search')}>
            <Search size={15} /> Find Books
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentBooks.map(book => {
            const pct = activeTab === 'currently_reading' && book.page_count > 0
              ? Math.round(Math.min(100, (book.current_page / book.page_count) * 100))
              : 0
            return (
              <div
                key={book.id}
                onClick={() => navigate(`/book/${book.id}`)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-rose-100 mb-3 group-hover:-translate-y-1 transition-transform">
                  {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen size={32} className="text-rose-300" />
                    </div>
                  )}
                  {activeTab === 'finished' && (
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-mint-500 text-white flex items-center justify-center shadow">
                      <CheckCircle size={14} />
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-bold text-stone-800 leading-tight truncate">{book.title}</h3>
                <p className="text-xs text-stone-500 truncate">{book.author}</p>

                {activeTab === 'currently_reading' && book.page_count > 0 && (
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-stone-400">
                      <span className="flex items-center gap-1"><TrendingUp size={10} /> {pct}%</span>
                      <span>{book.current_page}/{book.page_count}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'finished' && book.finished_at && (
                  <span className="mt-2 inline-flex items-center gap-1 text-[10px] text-stone-400">
                    <Clock size={10} />
                    {new Date(book.finished_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
