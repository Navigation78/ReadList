import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Loading from '../components/common/Loading'
import Modal from '../components/common/Modal'
import {
  ArrowLeft, BookOpen, Calendar, Hash, FileText,
  CheckCircle2, Trophy, Library, RefreshCw, Trash2,
  BookMarked, AlertCircle, CheckCircle
} from 'lucide-react'

// status pill styling and label, kept in one place so the badge and modal buttons agree
const statusMeta = {
  want_to_read: { label: 'Want to Read', badge: 'bg-lavender-100 text-lavender-700' },
  currently_reading: { label: 'Currently Reading', badge: 'bg-rose-100 text-rose-700' },
  finished: { label: 'Finished', badge: 'bg-mint-100 text-mint-700' }
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
    <div className="max-w-5xl mx-auto px-6 py-10 relative">
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
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-rose-500 transition mb-8"
      >
        <ArrowLeft size={16} /> Back to library
      </button>

      {/* header: cover plus core info */}
      <div className="grid md:grid-cols-[220px_1fr] gap-8 mb-10">
        <div className="aspect-[2/3] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(248,200,220,0.4)] bg-rose-100">
          {book.cover_url ? (
            <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen size={56} className="text-rose-300" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${statusMeta[book.status]?.badge}`}>
              {statusMeta[book.status]?.label || book.status}
            </span>
            <h1 className="font-display text-3xl font-bold text-rose-500 leading-tight mb-1">{book.title}</h1>
            <p className="text-stone-500">by {book.author}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            {book.published_year && (
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Calendar size={15} className="text-stone-400" />
                <span className="text-stone-400">Published</span>
                <span className="font-medium">{book.published_year}</span>
              </div>
            )}
            {book.page_count && (
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <FileText size={15} className="text-stone-400" />
                <span className="text-stone-400">Pages</span>
                <span className="font-medium">{book.page_count}</span>
              </div>
            )}
            {book.isbn && (
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Hash size={15} className="text-stone-400" />
                <span className="text-stone-400">ISBN</span>
                <span className="font-medium">{book.isbn}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => setShowStatusModal(true)}>
              <RefreshCw size={15} /> Change Status
            </Button>
            <Button variant="outline" onClick={() => setShowDeleteModal(true)}>
              <Trash2 size={15} /> Remove
            </Button>
          </div>
        </div>
      </div>

      {/* description */}
      {book.description && (
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] mb-6">
          <h2 className="font-display text-lg font-semibold text-stone-900 mb-3 flex items-center gap-2">
            <BookOpen size={18} className="text-rose-500" /> About this book
          </h2>
          <p className="text-stone-600 leading-relaxed">{book.description}</p>
        </div>
      )}

      {/* reading progress */}
      {book.status === 'currently_reading' && book.page_count && (
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] mb-6">
          <h2 className="font-display text-lg font-semibold text-stone-900 mb-5 flex items-center gap-2">
            <BookMarked size={18} className="text-rose-500" /> Reading Progress
          </h2>

          <div className="mb-6">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-stone-500">{currentPage} of {book.page_count} pages</span>
              <span className="font-bold text-rose-500">{progressPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-300 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleUpdateProgress} className="flex flex-col gap-4">
            <Input
              label="Current page"
              type="number"
              min="0"
              max={book.page_count}
              value={currentPage}
              onChange={(e) => setCurrentPage(parseInt(e.target.value) || 0)}
              helperText={`Enter a page between 0 and ${book.page_count}`}
            />
            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                variant="primary"
                loading={updatingProgress}
                disabled={updatingProgress || currentPage === book.current_page}
              >
                Update Progress
              </Button>
              {currentPage >= book.page_count && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleMarkAsFinished}
                  disabled={updatingProgress}
                >
                  <Trophy size={15} /> Mark as Finished
                </Button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* completion card */}
      {book.status === 'finished' && (
        <div className="bg-mint-50 border border-mint-100 rounded-3xl p-8 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-mint-100 text-mint-600 flex items-center justify-center">
              <Trophy size={26} />
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

      {/* timeline */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
        <h2 className="font-display text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
          <Calendar size={18} className="text-rose-500" /> Reading Timeline
        </h2>
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-lavender-100 text-lavender-600 flex items-center justify-center flex-shrink-0">
              <Library size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-800">Added to Library</p>
              <p className="text-sm text-stone-400">
                {new Date(book.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {book.started_at && (
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                <BookOpen size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-800">Started Reading</p>
                <p className="text-sm text-stone-400">
                  {new Date(book.started_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          )}

          {book.finished_at && (
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-mint-100 text-mint-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-800">Finished</p>
                <p className="text-sm text-stone-400">
                  {new Date(book.finished_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* change status modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => !changingStatus && setShowStatusModal(false)}
        title="Change Book Status"
        size="small"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-stone-500">Where would you like to move this book?</p>
          <div className="flex flex-col gap-2">
            {['want_to_read', 'currently_reading', 'finished'].map(s => (
              <Button
                key={s}
                variant={book.status === s ? 'primary' : 'outline'}
                fullWidth
                onClick={() => handleStatusChange(s)}
                disabled={changingStatus || book.status === s}
              >
                {statusMeta[s].label}
              </Button>
            ))}
          </div>
        </div>
      </Modal>

      {/* delete modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !deleting && setShowDeleteModal(false)}
        title="Remove Book?"
        size="small"
      >
        <div className="flex flex-col gap-5">
          <p className="text-sm text-stone-600 leading-relaxed">
            Are you sure you want to remove &ldquo;{book.title}&rdquo; from your library?
            This action cannot be undone.
          </p>
          <div className="flex flex-col gap-2">
            <Button variant="danger" fullWidth onClick={handleDelete} loading={deleting} disabled={deleting}>
              {deleting ? 'Removing...' : 'Yes, remove book'}
            </Button>
            <Button variant="outline" fullWidth onClick={() => setShowDeleteModal(false)} disabled={deleting}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}