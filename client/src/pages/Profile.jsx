import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Loading from '../components/common/Loading'
import Modal from '../components/common/Modal'
import {
  BookMarked, CheckCircle, BookOpen, Bookmark,
  Shield, LogOut, Trash2, AlertTriangle, User,
  Key, CheckCircle2, ChevronRight, Sparkles
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
          totalBooks: books.length,
          booksRead: books.filter(b => b.status === 'finished').length,
          currentlyReading: books.filter(b => b.status === 'currently_reading').length,
          wantToRead: books.filter(b => b.status === 'want_to_read').length,
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

  // four stat tiles, cycling through the three brand tints plus a neutral stone tile
  const statItems = [
    { icon: BookMarked, label: 'Total Books', value: stats.totalBooks, tint: 'lavender' },
    { icon: CheckCircle, label: 'Finished', value: stats.booksRead, tint: 'mint' },
    { icon: BookOpen, label: 'Reading', value: stats.currentlyReading, tint: 'rose' },
    { icon: Bookmark, label: 'Want to Read', value: stats.wantToRead, tint: 'stone' },
  ]

  const statTint = {
    lavender: { box: 'bg-lavender-50 border-lavender-100', icon: 'bg-lavender-100 text-lavender-600', text: 'text-lavender-600' },
    mint: { box: 'bg-mint-50 border-mint-100', icon: 'bg-mint-100 text-mint-600', text: 'text-mint-600' },
    rose: { box: 'bg-rose-50 border-rose-100', icon: 'bg-rose-100 text-rose-600', text: 'text-rose-600' },
    stone: { box: 'bg-stone-50 border-stone-200', icon: 'bg-stone-100 text-stone-500', text: 'text-stone-600' }
  }

  return (
    <div className="relative max-w-5xl mx-auto px-6 py-10 overflow-hidden">
      {/* floating decorative sparkles, purely visual */}
      <Sparkles
        className="hidden lg:block absolute top-4 right-16 text-rose-200 pointer-events-none"
        size={36}
        style={{ animation: 'float 6s ease-in-out infinite' }}
      />
      <Sparkles
        className="hidden lg:block absolute bottom-40 left-2 text-mint-200 pointer-events-none"
        size={28}
        style={{ animation: 'float 6s ease-in-out infinite 2s' }}
      />

      {/* header with icon avatar */}
      <div className="relative z-10 flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shadow-[0_4px_20px_rgba(248,200,220,0.4)]">
          <User size={28} />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-rose-500">Profile Settings</h1>
          <p className="text-stone-500">Manage your account and preferences</p>
        </div>
      </div>

      {successMessage && (
        <div
          role="alert"
          className="relative z-10 mb-6 flex items-center gap-2 bg-mint-50 border border-mint-200 text-mint-700 text-sm font-medium rounded-full px-5 py-3"
        >
          <CheckCircle2 size={16} /> {successMessage}
        </div>
      )}

      <div className="relative z-10 flex flex-col gap-10">
        {/* account info */}
        <section>
          <h2 className="font-display text-lg font-semibold text-rose-500 mb-4 ml-1">Account Info</h2>
          <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-10px_rgba(121,84,101,0.15)] border border-white/60">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Email Address</label>
                <p className="text-sm font-medium text-stone-800">{userData.email}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Member Since</label>
                <p className="text-sm font-medium text-stone-800">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">User ID</label>
                <code className="text-xs font-medium text-stone-600 bg-stone-100 px-2 py-1 rounded-lg break-all">
                  {user.id}
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* reading statistics */}
        <section>
          <h2 className="font-display text-lg font-semibold text-rose-500 mb-4 ml-1">Reading Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statItems.map(({ icon: Icon, label, value, tint }) => {
              const c = statTint[tint]
              return (
                <div
                  key={label}
                  className={`rounded-3xl p-6 flex flex-col items-center text-center border shadow-[0_10px_40px_-15px_rgba(121,84,101,0.2)] hover:scale-[1.02] transition-transform ${c.box}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${c.icon}`}>
                    <Icon size={18} />
                  </div>
                  <span className={`font-display text-3xl font-bold ${c.text}`}>{value}</span>
                  <span className="text-xs text-stone-500 mt-1">{label}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* security */}
        <section>
          <h2 className="font-display text-lg font-semibold text-rose-500 mb-4 ml-1">Security</h2>
          <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-10px_rgba(121,84,101,0.15)] border border-white/60">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-lavender-100 text-lavender-600 flex items-center justify-center flex-shrink-0">
                  <Key size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-800">Change Password</p>
                  <p className="text-sm text-stone-500">Update your account password regularly</p>
                </div>
              </div>
              <Button variant="outline" size="small" onClick={() => setShowPasswordModal(true)}>
                Update
              </Button>
            </div>
          </div>
        </section>

        {/* danger zone */}
        <section>
          <h2 className="font-display text-lg font-semibold text-red-500 mb-4 ml-1 flex items-center gap-2">
            <AlertTriangle size={18} /> Danger Zone
          </h2>
          <div className="bg-red-50/60 rounded-3xl p-8 border border-red-100 flex flex-col gap-5">
            <button
              onClick={handleLogout}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white text-stone-500 flex items-center justify-center flex-shrink-0">
                  <LogOut size={18} />
                </div>
                <p className="text-sm font-semibold text-stone-800">Log Out</p>
              </div>
              <ChevronRight size={18} className="text-stone-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="h-px bg-red-100" />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0">
                  <Trash2 size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-600">Delete Account</p>
                  <p className="text-sm text-stone-500">This action is permanent and cannot be undone</p>
                </div>
              </div>
              <Button variant="danger" size="small" onClick={() => setShowDeleteModal(true)}>
                Delete Forever
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* change password modal */}
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
        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
          {errors.submit && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {errors.submit}
            </div>
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
          <div className="flex flex-col gap-2 mt-2">
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

      {/* delete account modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account?"
        size="small"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
            <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              This action cannot be undone. All your books, reading progress, and data will be permanently deleted.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="danger" fullWidth onClick={handleDeleteAccount}>Yes, Delete My Account</Button>
            <Button variant="outline" fullWidth onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}