import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Loading from '../components/common/Loading'
import Modal from '../components/common/Modal'
import styles from './Profile.module.css'
import {
  BookMarked, CheckCircle, BookOpen, Bookmark,
  Shield, LogOut, Trash2, AlertTriangle, User,
  Calendar, Key, CheckCircle2
} from 'lucide-react'

export default function Profile() {
  const { user, logout, updatePassword } = useAuth()
  const navigate = useNavigate()

  const [userData] = useState({
    email: user?.email || '',
  })

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  const [stats, setStats] = useState({
    totalBooks: 0, booksRead: 0, currentlyReading: 0, wantToRead: 0,
  })

  const [loading, setLoading] = useState(true)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (!user) return
    async function loadStats() {
      try {
        setLoading(true)
        const books = await bookService.getBooks(user.id)
        setStats({
          totalBooks:       books.length,
          booksRead:        books.filter(b => b.status === 'finished').length,
          currentlyReading: books.filter(b => b.status === 'currently_reading').length,
          wantToRead:       books.filter(b => b.status === 'want_to_read').length,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [user])

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage('')
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

    const result = await updatePassword(passwordData.newPassword)
    if (result.success) {
      setSuccessMessage('Password updated successfully!')
      setPasswordData({ newPassword: '', confirmPassword: '' })
      setShowPasswordModal(false)
      setTimeout(() => setSuccessMessage(''), 3000)
    } else {
      setErrors({ submit: result.error || 'Failed to update password' })
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleDeleteAccount = async () => {
    alert('Account deletion is not implemented in this demo.')
    setShowDeleteModal(false)
  }

  if (loading) return <Loading text="Loading profile..." />

  const statItems = [
    { icon: BookMarked, label: 'Total Books',      value: stats.totalBooks,       color: '#3b5bdb', bg: '#e8edfb' },
    { icon: CheckCircle,label: 'Finished',         value: stats.booksRead,        color: '#2f9e44', bg: '#d3f9d8' },
    { icon: BookOpen,   label: 'Reading',          value: stats.currentlyReading, color: '#7048e8', bg: '#f3f0ff' },
    { icon: Bookmark,   label: 'Want to Read',     value: stats.wantToRead,       color: '#c2255c', bg: '#fff0f6' },
  ]

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Profile Settings</h1>
        <p className={styles.subtitle}>Manage your account and preferences</p>
      </div>

      {successMessage && (
        <div className={styles.successAlert}>
          <CheckCircle2 size={16} /> {successMessage}
        </div>
      )}

      {/* Account Info */}
      <section className={styles.section}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}><User size={16} /> Account Information</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{userData.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Member Since</span>
              <span className={styles.infoValue}>
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>User ID</span>
              <span className={styles.infoValueSmall}>{user.id}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reading Stats */}
      <section className={styles.section}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}><BookOpen size={16} /> Reading Statistics</h2>
          </div>
          <div className={styles.statsGrid}>
            {statItems.map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className={styles.statBox}>
                <div className={styles.statIconWrap} style={{ background: bg, color }}>
                  <Icon size={20} />
                </div>
                <span className={styles.statValue}>{value}</span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className={styles.section}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}><Shield size={16} /> Security</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.settingsRow}>
              <div className={styles.settingsRowLeft}>
                <Key size={16} className={styles.settingsRowIcon} />
                <div>
                  <h3 className={styles.settingsRowTitle}>Password</h3>
                  <p className={styles.settingsRowDesc}>Change your password to keep your account secure</p>
                </div>
              </div>
              <Button variant="outline" size="small" onClick={() => setShowPasswordModal(true)}>
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className={styles.section}>
        <div className={`${styles.card} ${styles.dangerCard}`}>
          <div className={styles.cardHeader}>
            <h2 className={`${styles.cardTitle} ${styles.dangerTitle}`}>
              <AlertTriangle size={16} /> Danger Zone
            </h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.settingsRow}>
              <div className={styles.settingsRowLeft}>
                <LogOut size={16} className={styles.settingsRowIcon} />
                <div>
                  <h3 className={styles.settingsRowTitle}>Log Out</h3>
                  <p className={styles.settingsRowDesc}>Sign out of your account on this device</p>
                </div>
              </div>
              <Button variant="outline" size="small" onClick={handleLogout}>
                Log Out
              </Button>
            </div>

            <div className={`${styles.settingsRow} ${styles.dangerRow}`}>
              <div className={styles.settingsRowLeft}>
                <Trash2 size={16} className={styles.settingsRowIconDanger} />
                <div>
                  <h3 className={styles.settingsRowTitle}>Delete Account</h3>
                  <p className={styles.settingsRowDesc}>Permanently delete your account and all data</p>
                </div>
              </div>
              <Button variant="danger" size="small" onClick={() => setShowDeleteModal(true)}>
                Delete Account
              </Button>
            </div>
          </div>
        </div>
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
            <div className={styles.errorAlert}>{errors.submit}</div>
          )}
          <Input
            label="New Password"
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
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
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            error={errors.confirmPassword}
            fullWidth
            required
          />
          <div className={styles.modalActions}>
            <Button type="submit" variant="primary" fullWidth>Update Password</Button>
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

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account?"
        size="small"
      >
        <div className={styles.deleteModal}>
          <div className={styles.deleteWarning}>
            <AlertTriangle size={18} className={styles.deleteWarningIcon} />
            <p>
              This action cannot be undone. All your books, reading progress, and data will be permanently deleted.
            </p>
          </div>
          <div className={styles.modalActions}>
            <Button variant="danger" fullWidth onClick={handleDeleteAccount}>Yes, Delete My Account</Button>
            <Button variant="outline" fullWidth onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
