import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Card from '../components/common/Card'
import Loading from '../components/common/Loading'
import Modal from '../components/common/Modal'
import styles from './Profile.module.css'

export default function Profile() {
  const { user, logout, updatePassword } = useAuth()
  const navigate = useNavigate()
  
  // Profile data state
  const [userData, setUserData] = useState({
    email: user?.email || '',
    displayName: user?.user_metadata?.display_name || ''
  })
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  
  // Statistics state
  const [stats, setStats] = useState({
    totalBooks: 0,
    booksRead: 0,
    currentlyReading: 0,
    wantToRead: 0
  })
  
  // UI state
  const [loading, setLoading] = useState(true)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  /**
   * Load user statistics on component mount
   */
  useEffect(() => {
    if (!user) return

    async function loadStats() {
      try {
        setLoading(true)
        const books = await bookService.getBooks(user.id)
        
        setStats({
          totalBooks: books.length,
          booksRead: books.filter(b => b.status === 'finished').length,
          currentlyReading: books.filter(b => b.status === 'currently_reading').length,
          wantToRead: books.filter(b => b.status === 'want_to_read').length
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [user])

  /**
   * Handle password change
   */
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage('')

    // Validate passwords
    const newErrors = {}
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Password is required'
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Update password
    const result = await updatePassword(passwordData.newPassword)

    if (result.success) {
      setSuccessMessage('Password updated successfully!')
      setPasswordData({ newPassword: '', confirmPassword: '' })
      setShowPasswordModal(false)
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000)
    } else {
      setErrors({ submit: result.error || 'Failed to update password' })
    }
  }

  /**
   * Handle account logout
   */
  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  /**
   * Handle account deletion (placeholder)
   * In a real app, this would call a delete endpoint
   */
  const handleDeleteAccount = async () => {
    // This is a placeholder - implement actual deletion logic
    alert('Account deletion would happen here. Not implemented in this demo.')
    setShowDeleteModal(false)
  }

  if (loading) {
    return <Loading text="Loading profile..." />
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Profile Settings</h1>
        <p className={styles.subtitle}>Manage your account and preferences</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className={styles.successAlert}>
          ✓ {successMessage}
        </div>
      )}

      {/* Account Information Section */}
      <section className={styles.section}>
        <Card variant="default">
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Account Information</h2>
          </div>

          <div className={styles.cardContent}>
            {/* Email (read-only) */}
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{userData.email}</span>
            </div>

            {/* User ID (for reference) */}
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>User ID</span>
              <span className={styles.infoValueSmall}>{user.id}</span>
            </div>

            {/* Member since */}
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Member Since</span>
              <span className={styles.infoValue}>
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </Card>
      </section>

      {/* Reading Statistics Section */}
      <section className={styles.section}>
        <Card variant="default">
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Reading Statistics</h2>
          </div>

          <div className={styles.statsGrid}>
            {/* Total Books */}
            <div className={styles.statBox}>
              <span className={styles.statIcon}>📚</span>
              <span className={styles.statValue}>{stats.totalBooks}</span>
              <span className={styles.statLabel}>Total Books</span>
            </div>

            {/* Books Read */}
            <div className={styles.statBox}>
              <span className={styles.statIcon}>✓</span>
              <span className={styles.statValue}>{stats.booksRead}</span>
              <span className={styles.statLabel}>Finished</span>
            </div>

            {/* Currently Reading */}
            <div className={styles.statBox}>
              <span className={styles.statIcon}>📖</span>
              <span className={styles.statValue}>{stats.currentlyReading}</span>
              <span className={styles.statLabel}>Reading</span>
            </div>

            {/* Want to Read */}
            <div className={styles.statBox}>
              <span className={styles.statIcon}>🔖</span>
              <span className={styles.statValue}>{stats.wantToRead}</span>
              <span className={styles.statLabel}>To Read</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Security Section */}
      <section className={styles.section}>
        <Card variant="default">
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Security</h2>
          </div>

          <div className={styles.cardContent}>
            <div className={styles.securityItem}>
              <div>
                <h3 className={styles.securityTitle}>Password</h3>
                <p className={styles.securityDescription}>
                  Change your password to keep your account secure
                </p>
              </div>
              <Button 
                variant="outline" 
                size="small"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Danger Zone Section */}
      <section className={styles.section}>
        <Card variant="default">
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Danger Zone</h2>
          </div>

          <div className={styles.cardContent}>
            {/* Logout */}
            <div className={styles.dangerItem}>
              <div>
                <h3 className={styles.dangerTitle}>Logout</h3>
                <p className={styles.dangerDescription}>
                  Sign out of your account on this device
                </p>
              </div>
              <Button 
                variant="outline" 
                size="small"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>

            {/* Delete Account */}
            <div className={styles.dangerItem}>
              <div>
                <h3 className={styles.dangerTitle}>Delete Account</h3>
                <p className={styles.dangerDescription}>
                  Permanently delete your account and all your data
                </p>
              </div>
              <Button 
                variant="danger" 
                size="small"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false)
          setPasswordData({ newPassword: '', confirmPassword: '' })
          setErrors({})
        }}
        title="Change Password"
        size="small"
      >
        <form onSubmit={handlePasswordChange} className={styles.modalForm}>
          {errors.submit && (
            <div className={styles.errorAlert}>
              {errors.submit}
            </div>
          )}

          <Input
            label="New Password"
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({
              ...prev,
              newPassword: e.target.value
            }))}
            error={errors.newPassword}
            helperText="Must be at least 6 characters"
            fullWidth
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({
              ...prev,
              confirmPassword: e.target.value
            }))}
            error={errors.confirmPassword}
            fullWidth
            required
          />

          <div className={styles.modalActions}>
            <Button 
              type="submit" 
              variant="primary" 
              fullWidth
            >
              Update Password
            </Button>
            <Button 
              type="button"
              variant="ghost" 
              fullWidth
              onClick={() => {
                setShowPasswordModal(false)
                setPasswordData({ newPassword: '', confirmPassword: '' })
                setErrors({})
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account?"
        size="small"
      >
        <div className={styles.deleteModal}>
          <p className={styles.deleteWarning}>
            ⚠️ This action cannot be undone. All your books, reading progress, 
            and data will be permanently deleted.
          </p>
          
          <div className={styles.modalActions}>
            <Button 
              variant="danger" 
              fullWidth
              onClick={handleDeleteAccount}
            >
              Yes, Delete My Account
            </Button>
            <Button 
              variant="outline" 
              fullWidth
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}