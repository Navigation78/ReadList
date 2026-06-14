import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Loading from '../components/common/Loading'
import Modal from '../components/common/Modal'
import styles from './BookDetail.module.css'
import {
  ArrowLeft, BookOpen, Calendar, Hash, FileText,
  CheckCircle2, Trophy, Library, RefreshCw, Trash2,
  BookMarked, AlertCircle, CheckCircle
} from 'lucide-react'

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
      showToast(`Moved to ${getStatusLabel(newStatus)}`)
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

  const getStatusLabel = (status) => {
    switch (status) {
      case 'want_to_read':      return 'Want to Read'
      case 'currently_reading': return 'Currently Reading'
      case 'finished':          return 'Finished'
      default:                  return status
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'want_to_read':      return styles.statusWant
      case 'currently_reading': return styles.statusReading
      case 'finished':          return styles.statusFinished
      default:                  return ''
    }
  }

  const progressPercentage = book?.page_count
    ? Math.min(100, Math.round((currentPage / book.page_count) * 100))
    : 0

  if (loading) return <Loading text="Loading book details..." />

  if (!book) {
    return (
      <div className={styles.errorContainer}>
        <BookOpen size={48} className={styles.errorIcon} />
        <h2>Book not found</h2>
        <Button onClick={() => navigate('/library')}>Back to Library</Button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Toast notification */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'error' ? styles.toastError : styles.toastSuccess}`}>
          {toast.type === 'error'
            ? <AlertCircle size={16} />
            : <CheckCircle size={16} />
          }
          {toast.message}
        </div>
      )}

      {/* Back */}
      <button className={styles.backButton} onClick={() => navigate('/library')}>
        <ArrowLeft size={16} /> Back to Library
      </button>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.coverSection}>
          <div className={styles.coverWrapper}>
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} className={styles.cover} />
            ) : (
              <div className={styles.placeholderCover}>
                <BookOpen size={64} color="#fff" />
              </div>
            )}
          </div>
        </div>

        <div className={styles.infoSection}>
          <div>
            <span className={`${styles.statusBadge} ${getStatusStyle(book.status)}`}>
              {getStatusLabel(book.status)}
            </span>
            <h1 className={styles.title}>{book.title}</h1>
            <p className={styles.author}>by {book.author}</p>
          </div>

          <div className={styles.metadata}>
            {book.published_year && (
              <div className={styles.metaItem}>
                <Calendar size={14} className={styles.metaIcon} />
                <div>
                  <span className={styles.metaLabel}>Published</span>
                  <span className={styles.metaValue}>{book.published_year}</span>
                </div>
              </div>
            )}
            {book.page_count && (
              <div className={styles.metaItem}>
                <FileText size={14} className={styles.metaIcon} />
                <div>
                  <span className={styles.metaLabel}>Pages</span>
                  <span className={styles.metaValue}>{book.page_count}</span>
                </div>
              </div>
            )}
            {book.isbn && (
              <div className={styles.metaItem}>
                <Hash size={14} className={styles.metaIcon} />
                <div>
                  <span className={styles.metaLabel}>ISBN</span>
                  <span className={styles.metaValue}>{book.isbn}</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <Button variant="primary" onClick={() => setShowStatusModal(true)}>
              <RefreshCw size={15} /> Change Status
            </Button>
            <Button variant="outline" onClick={() => setShowDeleteModal(true)}>
              <Trash2 size={15} /> Remove
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      {book.description && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <BookOpen size={16} /> About this book
          </h2>
          <p className={styles.description}>{book.description}</p>
        </div>
      )}

      {/* Reading Progress */}
      {book.status === 'currently_reading' && book.page_count && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <BookMarked size={16} /> Reading Progress
          </h2>

          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>
                {currentPage} of {book.page_count} pages
              </span>
              <span className={styles.progressPercentage}>{progressPercentage}%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>

          <form onSubmit={handleUpdateProgress} className={styles.progressForm}>
            <Input
              label="Current Page"
              type="number"
              min="0"
              max={book.page_count}
              value={currentPage}
              onChange={(e) => setCurrentPage(parseInt(e.target.value) || 0)}
              helperText={`Enter a page between 0 and ${book.page_count}`}
            />
            <div className={styles.progressActions}>
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

      {/* Completion card */}
      {book.status === 'finished' && (
        <div className={`${styles.card} ${styles.completionCard}`}>
          <div className={styles.completionInfo}>
            <div className={styles.completionIconWrap}>
              <Trophy size={28} />
            </div>
            <div>
              <p className={styles.completionText}>You finished this book!</p>
              {book.finished_at && (
                <p className={styles.completionDate}>
                  Completed on {new Date(book.finished_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          <Calendar size={16} /> Reading Timeline
        </h2>
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={`${styles.timelineDot} ${styles.dotBlue}`}>
              <Library size={14} />
            </div>
            <div className={styles.timelineContent}>
              <span className={styles.timelineLabel}>Added to Library</span>
              <span className={styles.timelineDate}>
                {new Date(book.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {book.started_at && (
            <div className={styles.timelineItem}>
              <div className={`${styles.timelineDot} ${styles.dotIndigo}`}>
                <BookOpen size={14} />
              </div>
              <div className={styles.timelineContent}>
                <span className={styles.timelineLabel}>Started Reading</span>
                <span className={styles.timelineDate}>
                  {new Date(book.started_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          )}

          {book.finished_at && (
            <div className={styles.timelineItem}>
              <div className={`${styles.timelineDot} ${styles.dotGreen}`}>
                <CheckCircle2 size={14} />
              </div>
              <div className={styles.timelineContent}>
                <span className={styles.timelineLabel}>Finished</span>
                <span className={styles.timelineDate}>
                  {new Date(book.finished_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => !changingStatus && setShowStatusModal(false)}
        title="Change Book Status"
        size="small"
      >
        <div className={styles.modalContent}>
          <p className={styles.modalText}>Where would you like to move this book?</p>
          <div className={styles.statusOptions}>
            {['want_to_read', 'currently_reading', 'finished'].map(s => (
              <Button
                key={s}
                variant={book.status === s ? 'primary' : 'outline'}
                fullWidth
                onClick={() => handleStatusChange(s)}
                disabled={changingStatus || book.status === s}
              >
                {getStatusLabel(s)}
              </Button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !deleting && setShowDeleteModal(false)}
        title="Remove Book?"
        size="small"
      >
        <div className={styles.deleteModal}>
          <p className={styles.deleteWarning}>
            Are you sure you want to remove "{book.title}" from your library?
            This action cannot be undone.
          </p>
          <div className={styles.deleteActions}>
            <Button variant="danger" fullWidth onClick={handleDelete} loading={deleting} disabled={deleting}>
              {deleting ? 'Removing…' : 'Yes, Remove Book'}
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
