import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Button from '../components/common/Button'
import Loading from '../components/common/Loading'
import Modal from '../components/common/Modal'
import {
  ArrowLeft, BookOpen, Calendar, Hash, FileText,
  CheckCircle2, Trophy, Library, RefreshCw, Trash2,
  BookMarked, AlertCircle, CheckCircle, Check,
  Star, Sparkles, Flower2, Bookmark, PauseCircle
} from 'lucide-react'

// status pill styling, label, and icon, kept in one place so badge, timeline, and modal all agree
const statusMeta = {
  want_to_read: { label: 'Want to Read', badge: 'bg-lavender-100 text-lavender-700', icon: Bookmark, tint: 'lavender' },
  currently_reading: { label: 'Currently Reading', badge: 'bg-rose-100 text-rose-700', icon: BookOpen, tint: 'rose' },
  finished: { label: 'Finished', badge: 'bg-mint-100 text-mint-700', icon: CheckCircle2, tint: 'mint' }
}

export default function BookDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [updatingProgress, setUpdatingProgress] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [changingStatus, setChangingStatus] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    if (!user || !id) return
    async function loadBook() {
      try {
        setLoading(true)
        const data = await bookService.getBookById(id)
        setBook(data)
        setCurrentPage(data.current_page || 0)
      } catch (error) {
        console.error('Error loading book:', error)
        navigate('/library')
      } finally {
        setLoading(false)
      }
    }
    loadBook()
  }, [id, user, navigate])

  const handleUpdateProgress = async (e) => {
    e.preventDefault()
    if (currentPage < 0 || currentPage > book.page_count) {
      showToast(`Page must be between 0 and ${book.page_count}`, 'error')
      return
    }
    try {
      setUpdatingProgress(true)
      const updatedBook = await bookService.updateProgress(book.id, currentPage)
      setBook(updatedBook)
      showToast('Progress updated!')
    } catch (error) {
      console.error('Error updating progress:', error)
      showToast('Failed to update progress', 'error')
    } finally {
      setUpdatingProgress(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      setChangingStatus(true)
      const updatedBook = await bookService.updateStatus(book.id, newStatus)
      setBook(updatedBook)
      setShowStatusModal(false)
      showToast(`Moved to ${statusMeta[newStatus].label}`)
    } catch (error) {
      console.error('Error changing status:', error)
      showToast('Failed to change status', 'error')
    } finally {
      setChangingStatus(false)
    }
  }

  const handleMarkAsFinished = async () => {
    try {
      setUpdatingProgress(true)
      const updatedBook = await bookService.markAsFinished(book.id)
      setBook(updatedBook)
      showToast('Congratulations on finishing this book!')
    } catch (error) {
      console.error('Error marking as finished:', error)
      showToast('Failed to mark as finished', 'error')
    } finally {
      setUpdatingProgress(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await bookService.deleteBook(book.id)
      navigate('/library')
    } catch (error) {
      console.error('Error deleting book:', error)
      showToast('Failed to remove book', 'error')
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const progressPercentage = book?.page_count
    ? Math.min(100, Math.round((currentPage / book.page_count) * 100))
    : 0

  if (loading) return <Loading text="Loading book details..." />

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <BookOpen size={48} className="text-stone-300" />
        <h2 className="font-display text-xl font-semibold text-stone-800">Book not found</h2>
        <Button onClick={() => navigate('/library')}>Back to Library</Button>
      </div>
    )
  }

  return (
    <div className="relative max-w-6xl mx-auto px-6 py-10 overflow-hidden">
      {/* floating decorative icons, purely visual, hidden on small screens */}
      <Star
        className="hidden lg:block absolute top-6 right-24 text-rose-200 pointer-events-none"
        size={48}
        style={{ animation: 'float 6s ease-in-out infinite' }}
      />
      <Sparkles
        className="hidden lg:block absolute top-56 left-4 text-mint-200 pointer-events-none"
        size={32}
        style={{ animation: 'float 6s ease-in-out infinite 2s' }}
      />
      <Flower2
        className="hidden lg:block absolute bottom-24 right-6 text-lavender-200 pointer-events-none"
        size={40}
        style={{ animation: 'float 6s ease-in-out infinite 4s' }}
      />

      {/* toast notification, floats top right */}
      {toast && (
        <div
          role="alert"
          className={`fixed top-6 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium shadow-lg ${
            toast.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-mint-50 text-mint-700 border border-mint-200'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* back link */}
      <button
        onClick={() => navigate('/library')}
        className="relative z-10 inline-flex items-center gap-2 text-sm font-semibold text-rose-500 hover:-translate-x-1 transition-transform mb-8"
      >
        <ArrowLeft size={16} /> Back to Library
      </button>

      {/* hero: cover plus core info */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-14">
        <div className="md:col-span-4 flex justify-center md:justify-start">
          <div className="relative">
            <div className="absolute -inset-4 bg-rose-200 blur-2xl opacity-30 rounded-[2.5rem]" />
            {book.cover_url ? (
              <img
                src={book.cover_url}
                alt={book.title}
                className="relative w-56 h-80 object-cover rounded-[2.5rem] shadow-[0_20px_50px_rgba(248,200,220,0.5)] border-4 border-white z-10"
              />
            ) : (
              <div className="relative w-56 h-80 rounded-[2.5rem] shadow-[0_20px_50px_rgba(248,200,220,0.5)] border-4 border-white z-10 bg-rose-100 flex items-center justify-center">
                <BookOpen size={56} className="text-rose-300" />
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-8 text-center md:text-left">
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide mb-3 ${statusMeta[book.status]?.badge}`}>
            {statusMeta[book.status]?.label || book.status}
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-rose-500 mb-2">{book.title}</h1>
          <p className="text-xl text-stone-500 mb-6">by {book.author}</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-8">
            {book.published_year && (
              <div className="flex flex-col">
                <span className="text-xs font-medium text-stone-400">Published</span>
                <span className="font-display font-semibold text-stone-800">{book.published_year}</span>
              </div>
            )}
            {book.page_count && (
              <>
                <div className="w-px h-10 bg-stone-200 hidden md:block" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-stone-400">Pages</span>
                  <span className="font-display font-semibold text-stone-800">{book.page_count}</span>
                </div>
              </>
            )}
            {book.isbn && (
              <>
                <div className="w-px h-10 bg-stone-200 hidden md:block" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-stone-400">ISBN</span>
                  <span className="font-display font-semibold text-stone-800">{book.isbn}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <Button variant="secondary" onClick={() => setShowStatusModal(true)}>
              <RefreshCw size={15} /> Change Status
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              <Trash2 size={15} /> Remove
            </Button>
          </div>
        </div>
      </section>

      {/* content grid: about spans two columns, progress and timeline stack in the third */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {book.description && (
          <div className="md:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(225,225,245,0.4)] h-fit">
            <h2 className="font-display text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-rose-500" /> About this book
            </h2>
            <p className="text-stone-600 leading-relaxed">{book.description}</p>
          </div>
        )}

        <div className={`flex flex-col gap-6 ${!book.description ? 'md:col-span-3' : ''}`}>
          {/* reading progress */}
          {book.status === 'currently_reading' && book.page_count && (
            <div className="bg-rose-50/60 backdrop-blur-sm border border-white rounded-[2.5rem] p-7 shadow-[0_20px_50px_rgba(248,200,220,0.35)]">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-display font-semibold text-stone-900">Reading Progress</h3>
                <div className="p-2 bg-white rounded-full text-rose-500">
                  <Trophy size={16} />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-display text-2xl font-bold text-rose-500">{progressPercentage}%</span>
                  <span className="text-xs text-stone-500">{currentPage} / {book.page_count} pages</span>
                </div>
                <div className="w-full h-3.5 bg-white/70 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-400 rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <form onSubmit={handleUpdateProgress} className="flex flex-col gap-3">
                <label className="text-xs font-medium text-stone-500 ml-1">Update current page</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max={book.page_count}
                    value={currentPage}
                    onChange={(e) => setCurrentPage(parseInt(e.target.value) || 0)}
                    className="w-full h-11 rounded-full bg-white border-none pl-5 pr-12 text-sm text-stone-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                  <button
                    type="submit"
                    disabled={updatingProgress || currentPage === book.current_page}
                    className="absolute right-1.5 top-1.5 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 disabled:opacity-50 transition"
                  >
                    <Check size={14} />
                  </button>
                </div>

                {currentPage >= book.page_count && (
                  <Button
                    type="button"
                    variant="primary"
                    fullWidth
                    onClick={handleMarkAsFinished}
                    disabled={updatingProgress}
                  >
                    <Trophy size={15} /> Mark as Finished
                  </Button>
                )}
              </form>
            </div>
          )}

          {/* completion card */}
          {book.status === 'finished' && (
            <div className="bg-mint-50 border border-mint-100 rounded-[2.5rem] p-7">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-mint-100 text-mint-600 flex items-center justify-center flex-shrink-0">
                  <Trophy size={24} />
                </div>
                <div>
                  <p className="font-display font-semibold text-mint-700">You finished this book!</p>
                  {book.finished_at && (
                    <p className="text-sm text-mint-600/80">
                      Completed on {new Date(book.finished_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* timeline with a connecting line */}
          <div className="bg-white rounded-[2.5rem] p-7 shadow-[0_20px_50px_rgba(225,225,245,0.4)]">
            <h3 className="font-display font-semibold text-stone-900 mb-5">Timeline</h3>
            <div className="relative ml-2 space-y-6">
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-stone-100" />

              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-mint-300 ring-4 ring-white" />
                <p className="text-sm font-semibold text-stone-800">Added to Library</p>
                <p className="text-xs text-stone-400">
                  {new Date(book.created_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>

              {book.started_at ? (
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-rose-300 ring-4 ring-white" />
                  <p className="text-sm font-semibold text-stone-800">Started Reading</p>
                  <p className="text-xs text-stone-400">
                    {new Date(book.started_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
              ) : (
                <div className="relative pl-8 opacity-40">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-stone-200 ring-4 ring-white" />
                  <p className="text-sm font-semibold text-stone-500">Started Reading</p>
                  <p className="text-xs text-stone-400">Not started yet</p>
                </div>
              )}

              {book.finished_at ? (
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-mint-400 ring-4 ring-white" />
                  <p className="text-sm font-semibold text-stone-800">Finished</p>
                  <p className="text-xs text-stone-400">
                    {new Date(book.finished_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
              ) : (
                <div className="relative pl-8 opacity-40">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-stone-200 ring-4 ring-white" />
                  <p className="text-sm font-semibold text-stone-500">Finished Reading</p>
                  <p className="text-xs text-stone-400">TBD</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* change status modal, rows instead of stacked buttons */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => !changingStatus && setShowStatusModal(false)}
        title="Change Status"
        size="small"
      >
        <div className="flex flex-col gap-2">
          {['currently_reading', 'finished', 'want_to_read'].map((s) => {
            const meta = statusMeta[s]
            const Icon = meta.icon
            const active = book.status === s
            return (
              <button
                key={s}
                type="button"
                onClick={() => !active && handleStatusChange(s)}
                disabled={changingStatus || active}
                className={`w-full text-left p-4 rounded-2xl border-2 flex items-center gap-3 transition disabled:cursor-default ${
                  active
                    ? `border-${meta.tint}-300 bg-${meta.tint}-50`
                    : 'border-transparent hover:bg-stone-50'
                }`}
              >
                <Icon size={18} className={active ? `text-${meta.tint}-600` : 'text-stone-400'} />
                <span className={`text-sm font-medium ${active ? `text-${meta.tint}-700` : 'text-stone-700'}`}>
                  {meta.label}
                </span>
              </button>
            )
          })}
        </div>
      </Modal>

      {/* delete modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !deleting && setShowDeleteModal(false)}
        title="Remove Book?"
        size="small"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
            <Trash2 size={26} />
          </div>
          <p className="text-sm text-stone-600 leading-relaxed">
            Are you sure you want to remove &ldquo;{book.title}&rdquo; from your library?
            This action cannot be undone.
          </p>
          <div className="flex gap-3 w-full">
            <Button variant="outline" fullWidth onClick={() => setShowDeleteModal(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" fullWidth onClick={handleDelete} loading={deleting} disabled={deleting}>
              {deleting ? 'Removing...' : 'Remove'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}