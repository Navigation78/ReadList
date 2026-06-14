import { useState, useRef, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../common/Navbar'
import styles from './ProtectedLayout.module.css'
import { Search, Bell, ChevronDown, User, LogOut } from 'lucide-react'

function ProtectedLayout({ children }) {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (loading) return <div className={styles.loading}>Loading…</div>
  if (!user) return <Navigate to="/login" replace />

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Reader'
  const initials = displayName.slice(0, 2).toUpperCase()

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) navigate('/login')
  }

  const sidebarWidth = collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'

  return (
    <div className={styles.shell}>
      <Navbar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

      {/* Right side: header + content */}
      <div className={styles.rightSide} style={{ marginLeft: sidebarWidth }}>
        {/* Top header */}
        <header className={styles.header}>
          {/* Search */}
          <div className={styles.searchWrap}>
            <Search size={15} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search books, authors…"
              onKeyDown={e => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`)
                }
              }}
            />
          </div>

          {/* Right controls */}
          <div className={styles.headerRight}>
            {/* Bell */}
            <button className={styles.iconBtn} title="Notifications">
              <Bell size={18} />
              <span className={styles.bellDot} />
            </button>

            {/* Profile dropdown */}
            <div className={styles.profileWrap} ref={dropRef}>
              <button
                className={styles.profileBtn}
                onClick={() => setProfileOpen(o => !o)}
              >
                <div className={styles.avatar}>{initials}</div>
                <span className={styles.profileName}>{displayName}</span>
                <ChevronDown size={14} className={`${styles.chevron} ${profileOpen ? styles.chevronOpen : ''}`} />
              </button>

              {profileOpen && (
                <div className={styles.dropdown}>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => { navigate('/profile'); setProfileOpen(false) }}
                  >
                    <User size={14} /> Profile
                  </button>
                  <div className={styles.dropdownDivider} />
                  <button
                    className={`${styles.dropdownItem} ${styles.dropdownDanger}`}
                    onClick={handleLogout}
                  >
                    <LogOut size={14} /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}

export default ProtectedLayout
