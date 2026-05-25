import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Navbar.module.css'
import { Home, BookMarked, Search, BarChart2, User, LogOut, Bell } from 'lucide-react'

const navItems = [
  { to: '/',        icon: Home,       label: 'Home'    },
  { to: '/library', icon: BookMarked, label: 'Library' },
  { to: '/search',  icon: Search,     label: 'Search'  },
  { to: '/stats',   icon: BarChart2,  label: 'Stats'   },
  { to: '/profile', icon: User,       label: 'Profile' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className={styles.sidebar}>
      {/* Logo mark */}
      <div className={styles.logoMark}>
        <BookMarked size={22} className={styles.logoIcon} />
      </div>

      {/* Main nav icons */}
      {user && (
        <div className={styles.navGroup}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`${styles.navItem} ${isActive(to) ? styles.active : ''}`}
              title={label}
            >
              <Icon size={20} />
            </Link>
          ))}
        </div>
      )}

      {/* Bottom actions */}
      <div className={styles.bottomGroup}>
        <button className={styles.navItem} title="Notifications">
          <Bell size={20} />
        </button>
        {user && (
          <button
            className={styles.navItem}
            onClick={handleLogout}
            title="Log out"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </nav>
  )
}
