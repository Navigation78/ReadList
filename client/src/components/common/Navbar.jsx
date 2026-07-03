import { Link, useLocation } from 'react-router-dom'
import { createElement } from 'react'
import { Home, BookMarked, Search, BarChart2, User, Settings, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './Navbar.module.css'
import logo from '../../assets/Black Logo.png'

const MENU_ITEMS = [
  { to: '/dashboard', icon: Home,       label: 'Dashboard' },
  { to: '/library', icon: BookMarked, label: 'Library'   },
  { to: '/search',  icon: Search,     label: 'Search'    },
  { to: '/stats',   icon: BarChart2,  label: 'Stats'     },
]

const OTHER_ITEMS = [
  { to: '/profile', icon: Settings, label: 'Settings' },
  { to: '/profile', icon: HelpCircle, label: 'Help'   },
]

export default function Navbar({ collapsed, onToggle }) {
  const location = useLocation()
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`)

  return (
    <nav className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Brand */}
      <div className={styles.brand}>
        <div className={styles.logoWrap}>
          <img src={logo} alt="ReadList" className={styles.logoImg} />
        </div>
        {!collapsed && <span className={styles.brandName}>ReadList</span>}
      </div>

      {/* Toggle button */}
      <button className={styles.toggleBtn} onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* MENU section */}
      <div className={styles.section}>
        {!collapsed && <span className={styles.sectionLabel}>MENU</span>}
        <div className={styles.navGroup}>
          {MENU_ITEMS.map(({ to, icon: Icon, label }) => (
            <Link
              key={to + label}
              to={to}
              className={`${styles.navItem} ${isActive(to) ? styles.active : ''}`}
              title={collapsed ? label : undefined}
            >
              <div className={styles.navItemInner}>
                {createElement(Icon, { size: 18, className: styles.navIcon })}
                {!collapsed && <span className={styles.navLabel}>{label}</span>}
              </div>
              {isActive(to) && <div className={styles.activeBar} />}
            </Link>
          ))}
        </div>
      </div>

      {/* OTHERS section */}
      <div className={`${styles.section} ${styles.othersSection}`}>
        {!collapsed && <span className={styles.sectionLabel}>OTHERS</span>}
        <div className={styles.navGroup}>
          {OTHER_ITEMS.map(({ to, icon: Icon, label }) => (
            <Link
              key={to + label}
              to={to}
              className={`${styles.navItem} ${location.pathname === to && label === 'Settings' ? styles.active : ''}`}
              title={collapsed ? label : undefined}
            >
              <div className={styles.navItemInner}>
                {createElement(Icon, { size: 18, className: styles.navIcon })}
                {!collapsed && <span className={styles.navLabel}>{label}</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
