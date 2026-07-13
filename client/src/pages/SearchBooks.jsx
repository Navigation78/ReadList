import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Loading from '../components/common/Loading'
import Modal from '../components/common/Modal'
import { Search, BookOpen, Plus, CheckCircle, AlertCircle } from 'lucide-react'


export default function SearchBooks() {
  const { user } = useAuth()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [addingBook, setAddingBook] = useState(false)
  const [addedIds, setAddedIds] = useState(new Set())
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const searchBooks = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setResults([])
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20&key=${apiKey}`
      )
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setResults(data.items || [])
      if (!data.items?.length) setError('No books found. Try a different search term.')
    } catch {
      setError('Failed to search books. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddClick = (book) => {
    setSelectedBook(book)
    setShowModal(true)
  }

  const closeModal = () => {
    if (addingBook) return
    setShowModal(false)
    setSelectedBook(null)
  }

  const addBookToLibrary = async (status) => {
    if (!selectedBook) return
    try {
      setAddingBook(true)
      const info = selectedBook.volumeInfo
      const bookData = {
        google_books_id: selectedBook.id,
        title:           info.title,
        author:          info.authors?.join(', ') || 'Unknown Author',
        description:     info.description || null,
        cover_url:       info.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
        page_count:      info.pageCount || null,
        isbn:            info.industryIdentifiers?.[0]?.identifier || null,
        published_year:  info.publishedDate ? parseInt(info.publishedDate.substring(0, 4)) : null,
        status,
        current_page:    0,
      }
      await bookService.addBook(user.id, bookData)
      setAddedIds(prev => new Set([...prev, selectedBook.id]))
      setShowModal(false)
      setSelectedBook(null)
      showToast(`"${info.title}" added to your library!`)
    } catch {
      showToast('Failed to add book. It might already be in your library.', 'error')
    } finally {
      setAddingBook(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#faf9f8] dark:bg-stone-950 px-6 py-10 md:px-12 overflow-hidden">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[110] flex items-center gap-2 rounded-full px-5 py-3 shadow-lg backdrop-blur-sm font-['Be_Vietnam_Pro'] text-sm font-medium ${
            toast.type === 'error'
              ? 'bg-[#ffdad6] text-[#93000a]'
              : 'bg-[#c1dcc6] text-[#4a6150]'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 max-w-4xl mx-auto text-center md:text-left mb-12">
        <h1 className="font-['Quicksand'] font-bold text-4xl md:text-5xl text-[#795465] mb-2">
          Search Books
        </h1>
        <p className="font-['Be_Vietnam_Pro'] text-lg text-[#4f4448] dark:text-stone-300">
          Find your next great read and add it to your library
        </p>

        <form onSubmit={searchBooks} className="mt-8 relative max-w-2xl mx-auto md:mx-0 flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#795465]/60 z-10 pointer-events-none" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, or ISBN…"
              className="w-full bg-[#f8c8dc]/30 border-none rounded-[2.5rem] py-4 pl-16 pr-6 font-['Quicksand'] font-medium text-[#795465] placeholder:text-[#795465]/40 focus:ring-4 focus:ring-[#f8c8dc] focus:bg-white transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(248,200,220,0.6)] outline-none"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !query.trim()}
            loading={loading}
            className="rounded-lg px-7 font-['Quicksand'] font-bold bg-[#795465] hover:bg-[#795465]/90 shadow-[0_10px_40px_-10px_rgba(248,200,220,0.6)]"
          >
            Search
          </Button>
        </form>
      </header>

      {/* Error */}
      {error && (
        <div className="relative z-10 max-w-2xl mx-auto md:mx-0 mb-8 flex items-center gap-2 rounded-2xl bg-[#ffdad6] text-[#93000a] px-5 py-4 font-['Be_Vietnam_Pro'] text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="relative z-10 py-16 text-[#795465]">
          <Loading text="Searching for books…" />
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="relative z-10 max-w-6xl mx-auto">
          <p className="flex items-center gap-2 font-['Be_Vietnam_Pro'] text-sm text-[#4f4448] dark:text-stone-300 mb-4">
            <Search size={14} /> {results.length} results found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(book => (
              <SearchBookCard
                key={book.id}
                book={book}
                onAdd={handleAddClick}
                added={addedIds.has(book.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title="Add to Library"
        size="small"
        className="rounded-[2.5rem] p-8"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#f8c8dc] flex items-center justify-center text-[#795465] mx-auto mb-6">
            <BookOpen size={30} />
          </div>
          <p className="font-['Be_Vietnam_Pro'] text-sm text-[#4f4448] dark:text-stone-300 mb-8">
            Where would you like to add<br />
            <strong className="text-[#795465]">"{selectedBook?.volumeInfo?.title}"</strong>?
          </p>

          <div className="space-y-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => addBookToLibrary('want_to_read')}
              disabled={addingBook}
              loading={addingBook}
              className="rounded-lg border-2 border-[#f8c8dc] text-[#795465] font-['Quicksand'] font-bold hover:bg-[#f8c8dc]/10"
            >
              Want to Read
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => addBookToLibrary('currently_reading')}
              disabled={addingBook}
              className="rounded-lg bg-[#e1e1f5] text-[#626374] font-['Quicksand'] font-bold hover:opacity-90"
            >
              Currently Reading
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => addBookToLibrary('finished')}
              disabled={addingBook}
              className="rounded-lg bg-[#795465] text-white font-['Quicksand'] font-bold hover:bg-[#795465]/90 shadow-lg"
            >
              Already Read
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function SearchBookCard({ book, onAdd, added }) {
  const info = book.volumeInfo
  return (
    <article className="group flex flex-col h-full bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(248,200,220,0.6)] hover:scale-[1.02] transition-transform duration-300">
      <div className="relative w-full aspect-[2/3] mb-6 rounded-[2rem] overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
        {info.imageLinks?.thumbnail ? (
          <img
            src={info.imageLinks.thumbnail.replace('http:', 'https:')}
            alt={info.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
          />
        ) : (
          <div className="w-full h-full bg-[#795465] flex items-center justify-center">
            <BookOpen size={28} color="#fff" />
          </div>
        )}

        <div className="absolute top-4 right-4">
          {added ? (
            <div className="w-11 h-11 rounded-full bg-[#f8c8dc] text-[#765162] flex items-center justify-center shadow-inner">
              <CheckCircle size={20} />
            </div>
          ) : (
            <button
              onClick={() => onAdd(book)}
              className="w-11 h-11 rounded-lg bg-white/90 dark:bg-stone-800/90 backdrop-blur text-[#795465] flex items-center justify-center hover:bg-[#795465] hover:text-white transition-all duration-300 shadow-sm"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex gap-2 mb-3">
          {info.publishedDate && (
            <span className="bg-[#e1e1f5] text-[#626374] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">
              {info.publishedDate.substring(0, 4)}
            </span>
          )}
          {info.pageCount && (
            <span className="bg-[#c1dcc6] text-[#4a6150] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">
              {info.pageCount} PAGES
            </span>
          )}
        </div>

        <h3 className="font-['Quicksand'] font-semibold text-xl text-[#795465] mb-1">{info.title}</h3>
        <p className="font-['Be_Vietnam_Pro'] italic text-[#4f4448] dark:text-stone-300 mb-4">
          {info.authors?.join(', ') || 'Unknown Author'}
        </p>

        {info.description && (
          <p className="font-['Be_Vietnam_Pro'] text-sm text-[#4f4448] dark:text-stone-300 line-clamp-3 mb-4">
            {info.description.substring(0, 130)}
            {info.description.length > 130 ? '…' : ''}
          </p>
        )}

        {added && (
          <div className="mt-auto flex items-center gap-2 text-[#4a6150] font-['Be_Vietnam_Pro'] text-sm font-medium">
            <CheckCircle size={14} /> Added to library
          </div>
        )}
      </div>
    </article>
  )
}