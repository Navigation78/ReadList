import { useState, useRef, useEffect } from 'react'
import { useNavigate, Navigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { LayoutDashboard, BarChart3, Library as LibraryIcon, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react'
import logoImage from '../../assets/Black Logo.png'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/stats', icon: BarChart3, label: 'Analytics' },
  { to: '/library', icon: LibraryIcon, label: 'Library' },
]

export default function ProtectedLayout({ children }) {
  const { user, logout, loading } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [profileOpen, setProfileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-stone-700 dark:text-stone-300 text-body-lg">
        Loading…
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Reader'

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const getHeaderTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard'
      case '/library':
        return 'My Library'
      case '/search':
        return 'Find Books'
      case '/stats':
        return 'Analytics'
      case '/profile':
        return 'Profile Settings'
      default:
        return 'ReadList'
    }
  }

  return (
    <div className="min-h-screen bg-background dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-rose-500 selection:text-white pastel-gradient-bg dark:!bg-none transition-colors">
      {/* SideNavBar Component */}
      <aside
        className={`fixed left-0 top-0 flex flex-col p-4 gap-6 z-40 h-screen bg-white dark:bg-stone-900 border-r border-stone-100 dark:border-stone-800 shadow-[10px_0_40px_-20px_rgba(248,200,220,0.3)] dark:shadow-none hidden md:flex transition-all duration-200 ${
          collapsed ? 'w-20' : 'w-56'
        }`}
      >
        <button
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-8 w-6 h-6 rounded-md bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-rose-500 hover:border-rose-300 transition"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className={`flex items-center gap-2 mb-2 px-1 ${collapsed ? 'justify-center' : ''}`}>
          <img src={logoImage} alt="ReadList" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
          {!collapsed && <h1 className="text-headline-md text-rose-500 font-display font-bold">ReadList</h1>}
        </div>

        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-4 py-3 font-bold rounded-lg transition-colors ${
                isActive(to)
                  ? 'bg-rose-500 text-white'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              } ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon size={20} />
              {!collapsed && <span className="text-body-md">{label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Canvas */}
      <main className={`min-h-screen pb-24 md:pb-0 transition-all duration-200 ${collapsed ? 'md:ml-20' : 'md:ml-56'}`}>
        {/* TopAppBar Component */}
        <header className="sticky top-0 bg-background/80 dark:bg-stone-950/80 backdrop-blur-md z-30 shadow-[0_10px_30px_-15px_rgba(248,200,220,0.4)] dark:shadow-none border-b border-transparent dark:border-stone-800">
          <div className="flex items-center justify-between w-full h-20 max-w-[1440px] mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <h2 className="text-headline-md text-rose-500">{getHeaderTitle()}</h2>
            </div>
            <div className="flex items-center gap-6">
              {/* Search Bar */}
              <div className="hidden sm:flex items-center bg-white dark:bg-stone-900 px-6 py-2 rounded-lg border border-rose-500/30 dark:border-stone-700 shadow-sm w-72">
                <span className="material-symbols-outlined text-stone-500 dark:text-stone-400 text-sm">search</span>
                <input
                  className="bg-transparent border-none focus:ring-0 text-label-md w-full ml-2 text-stone-900 dark:text-stone-100 focus:outline-none"
                  placeholder="Find a story..."
                  type="text"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`)
                    }
                  }}
                />
              </div>
              <button
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="text-stone-500 dark:text-stone-400 hover:bg-rose-500/20 transition-colors p-2 rounded-lg cursor-pointer active:scale-95 transition-transform"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="text-stone-500 dark:text-stone-400 hover:bg-rose-500/20 transition-colors p-2 rounded-lg cursor-pointer active:scale-95 transition-transform">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button
                onClick={() => navigate('/library')}
                className="text-stone-500 dark:text-stone-400 hover:bg-rose-500/20 transition-colors p-2 rounded-lg cursor-pointer active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined">favorite</span>
              </button>

              {/* Profile Avatar Dropdown */}
              <div className="relative" ref={dropRef}>
                <div
                  onClick={() => setProfileOpen(o => !o)}
                  className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-rose-300 active:scale-95 transition-transform cursor-pointer"
                >
                  <img
                    alt="Soft pink profile avatar"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXPtQV8POxOqKlFSSKT2JzVhHHKJAUVQGPPDPSSHPGqJn4U6CViVH_Quwu7yVB_uzgqA7uzvc7z6WIa2RPtUCVXaPyzTiL0K6shJ8BGgBHwFrvU8dEXq_gHreG7QiAEuVyAPO9KLZn2vC20l2SizQGc-5SVZdzInh7COsB8dCUdBIWPc2ddEEmJ_Zx9U-WHDGrZ3NMn4PAOHFwLPs5ev-rWf1jCVpG79F16jPyiBELKeQLvAC1CXHyTQ"
                  />
                </div>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-900 border border-rose-500/20 dark:border-stone-700 rounded-lg shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-rose-500/10 dark:border-stone-700">
                      <p className="text-label-md font-bold text-stone-900 dark:text-stone-100 truncate">{displayName}</p>
                      <p className="text-xs text-stone-600 dark:text-stone-400 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-label-md text-stone-900 dark:text-stone-100 hover:bg-rose-500/20 dark:hover:bg-stone-800 transition-colors w-full text-left"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      Profile
                    </Link>
                    <div className="h-[1px] bg-rose-500/10 dark:bg-stone-700 my-1" />
                    <button
                      onClick={() => { handleLogout(); setProfileOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2 text-label-md text-red-600 hover:bg-red-50/20 dark:hover:bg-red-950/30 transition-colors w-full text-left font-bold"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <div className="flex-1">
          {children}
        </div>
      </main>

      {/* BottomNavBar Component (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-white dark:bg-stone-900 shadow-[0_-10px_40px_-20px_rgba(248,200,220,0.3)] dark:shadow-none border-t border-rose-500/20 dark:border-stone-800 rounded-t-3xl">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center justify-center px-6 py-2 transition-all active:scale-95 ${
              isActive(to)
                ? 'bg-rose-500 text-white rounded-lg shadow-sm'
                : 'text-stone-600 dark:text-stone-400 p-2 hover:text-rose-500'
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
