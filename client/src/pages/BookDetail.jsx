import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Card from '../components/common/Card'
import Loading from '../components/common/Loading'
import Modal from '../components/common/Modal'
import styles from './BookDetail.module.css'

export default function BookDetail() {
  const { id } = useParams() // Get book ID from URL
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Book data state
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Progress update state
  const [currentPage, setCurrentPage] = useState(0)
  const [updatingProgress, setUpdatingProgress] = useState(false)
  
  // Status change state
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [changingStatus, setChangingStatus] = useState(false)
  
  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  /**
   * Load book data on component mount or when ID changes
   */
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
        alert('Failed to load book details')
        navigate('/library')
      } finally {
        setLoading(false)
      }
    }

    loadBook()
  }, [id, user, navigate])

  /**
   * Update reading progress
   */
  const handleUpdateProgress = async (e) => {
    e.preventDefault()
    
    // Validate page number
    if (currentPage < 0 || currentPage > book.page_count) {
      alert(`Please enter a page between 0 and ${book.page_count}`)
      return
    }

    try {
      setUpdatingProgress(true)
      
      // Update in database
      const updatedBook = await bookService.updateProgress(book.id, currentPage)
      
      // Update local state
      setBook(updatedBook)
      
      // Show success message
      alert('Progress updated successfully!')
    } catch (error) {
      console.error('Error updating progress:', error)
      alert('Failed to update progress. Please try again.')
    } finally {
      setUpdatingProgress(false)
    }
  }

  /**
   * Change book status (want_to_read, currently_reading, finished)
   */
  const handleStatusChange = async (newStatus) => {
    try {
      setChangingStatus(true)
      
      // Update in database
      const updatedBook = await bookService.updateStatus(book.id, newStatus)
      
      // Update local state
      setBook(updatedBook)
      
      // Close modal
      setShowStatusModal(false)
      
      // Show success message
      alert(`Book moved to ${newStatus.replace('_', ' ')}!`)
    } catch (error) {
      console.error('Error changing status:', error)
      alert('Failed to change status. Please try again.')
    } finally {
      setChangingStatus(false)
    }
  }

  /**
   * Mark book as finished
   */
  const handleMarkAsFinished = async () => {
    try {
      setUpdatingProgress(true)
      
      // Mark as finished in database
      const updatedBook = await bookService.markAsFinished(book.id)
      
      // Update local state
      setBook(updatedBook)
      
      // Show success message
      alert('Congratulations on finishing this book! 🎉')
    } catch (error) {
      console.error('Error marking as finished:', error)
      alert('Failed to mark as finished. Please try again.')
    } finally {
      setUpdatingProgress(false)
    }
  }

  /**
   * Delete book from library
   */
  const handleDelete = async () => {
    try {
      setDeleting(true)
      
      // Delete from database
      await bookService.deleteBook(book.id)
      
      // Show success and redirect
      alert('Book removed from your library')
      navigate('/library')
    } catch (error) {
      console.error('Error deleting book:', error)
      alert('Failed to delete book. Please try again.')
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  /**
   * Calculate reading progress percentage
   */
  const progressPercentage = book?.page_count 
    ? Math.round((currentPage / book.page_count) * 100) 
    : 0

  /**
   * Get status display name
   */
  const getStatusLabel = (status) => {
    switch(status) {
      case 'want_to_read':
        return 'Want to Read'
      case 'currently_reading':
        return 'Currently Reading'
      case 'finished':
        return 'Finished'
      default:
        return status
    }
  }

  /**
   * Get status badge color
   */
  const getStatusColor = (status) => {
    switch(status) {
      case 'want_to_read':
        return styles.statusWant
      case 'currently_reading':
        return styles.statusReading
      case 'finished':
        return styles.statusFinished
      default:
        return ''
    }
  }

  // Show loading state
  if (loading) {
    return <Loading text="Loading book details..." />
  }

  // Show error if book not found
  if (!book) {
    return (
      <div className={styles.errorContainer}>
        <h2>Book not found</h2>
        <Button onClick={() => navigate('/library')}>
          Back to Library
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <button 
        className={styles.backButton}
        onClick={() => navigate('/library')}
      >
        ← Back to Library
      </button>

      {/* Book Header Section */}
      <div className={styles.header}>
        {/* Book Cover */}
        <div className={styles.coverSection}>
          <div className={styles.coverWrapper}>
            {book.cover_url ? (
              <img 
                src={book.cover_url} 
                alt={book.title}
                className={styles.cover}
              />
            ) : (
              <div className={styles.placeholderCover}>
                <span>📚</span>
              </div>
            )}
          </div>
        </div>

        {/* Book Info */}
        <div className={styles.infoSection}>
          {/* Title and Author */}
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{book.title}</h1>
            <p className={styles.author}>by {book.author}</p>
            
            {/* Status Badge */}
            <div className={styles.statusBadgeWrapper}>
              <span className={`${styles.statusBadge} ${getStatusColor(book.status)}`}>
                {getStatusLabel(book.status)}
              </span>
            </div>
          </div>

          {/* Book Metadata */}
          <div className={styles.metadata}>
            {book.published_year && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Published</span>
                <span className={styles.metaValue}>{book.published_year}</span>
              </div>
            )}
            
            {book.page_count && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Pages</span>
                <span className={styles.metaValue}>{book.page_count}</span>
              </div>
            )}
            
            {book.isbn && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>ISBN</span>
                <span className={styles.metaValue}>{book.isbn}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <Button 
              variant="primary"
              onClick={() => setShowStatusModal(true)}
            >
              Change Status
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setShowDeleteModal(true)}
            >
              Remove Book
            </Button>
          </div>
        </div>
      </div>

      {/* Description Section */}
      {book.description && (
        <Card variant="default">
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Description</h2>
            <p className={styles.description}>{book.description}</p>
          </div>
        </Card>
      )}

      {/* Reading Progress Section - Only show if currently reading */}
      {book.status === 'currently_reading' && book.page_count && (
        <Card variant="default">
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Reading Progress</h2>
            
            {/* Progress Bar */}
            <div className={styles.progressSection}>
              <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>
                  {currentPage} / {book.page_count} pages
                </span>
                <span className={styles.progressPercentage}>
                  {progressPercentage}%
                </span>
              </div>
              
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Update Progress Form */}
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
                    Mark as Finished 🎉
                  </Button>
                )}
              </div>
            </form>
          </div>
        </Card>
      )}

      {/* Finished Book Info */}
      {book.status === 'finished' && (
        <Card variant="default">
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Completion Details</h2>
            <div className={styles.completionInfo}>
              <span className={styles.completionIcon}>🎉</span>
              <div>
                <p className={styles.completionText}>
                  You finished this book!
                </p>
                {book.finished_at && (
                  <p className={styles.completionDate}>
                    Completed on {new Date(book.finished_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Reading Dates */}
      <Card variant="default">
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Reading Timeline</h2>
          
          <div className={styles.timeline}>
            {/* Added Date */}
            <div className={styles.timelineItem}>
              <span className={styles.timelineIcon}>📚</span>
              <div className={styles.timelineContent}>
                <span className={styles.timelineLabel}>Added to Library</span>
                <span className={styles.timelineDate}>
                  {new Date(book.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Started Date */}
            {book.started_at && (
              <div className={styles.timelineItem}>
                <span className={styles.timelineIcon}>📖</span>
                <div className={styles.timelineContent}>
                  <span className={styles.timelineLabel}>Started Reading</span>
                  <span className={styles.timelineDate}>
                    {new Date(book.started_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            )}

            {/* Finished Date */}
            {book.finished_at && (
              <div className={styles.timelineItem}>
                <span className={styles.timelineIcon}>✓</span>
                <div className={styles.timelineContent}>
                  <span className={styles.timelineLabel}>Finished</span>
                  <span className={styles.timelineDate}>
                    {new Date(book.finished_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Change Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => !changingStatus && setShowStatusModal(false)}
        title="Change Book Status"
        size="small"
      >
        <div className={styles.modalContent}>
          <p className={styles.modalText}>
            Where would you like to move this book?
          </p>
          
          <div className={styles.statusOptions}>
            <Button
              variant={book.status === 'want_to_read' ? 'primary' : 'outline'}
              fullWidth
              onClick={() => handleStatusChange('want_to_read')}
              disabled={changingStatus || book.status === 'want_to_read'}
            >
              Want to Read
            </Button>
            
            <Button
              variant={book.status === 'currently_reading' ? 'primary' : 'outline'}
              fullWidth
              onClick={() => handleStatusChange('currently_reading')}
              disabled={changingStatus || book.status === 'currently_reading'}
            >
              Currently Reading
            </Button>
            
            <Button
              variant={book.status === 'finished' ? 'primary' : 'outline'}
              fullWidth
              onClick={() => handleStatusChange('finished')}
              disabled={changingStatus || book.status === 'finished'}
            >
              Finished
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
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
            <Button 
              variant="danger" 
              fullWidth
              onClick={handleDelete}
              loading={deleting}
              disabled={deleting}
            >
              {deleting ? 'Removing...' : 'Yes, Remove Book'}
            </Button>
            <Button 
              variant="outline" 
              fullWidth
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}