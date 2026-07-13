import { useState, useRef, useEffect } from 'react'
import { useNavigate, Navigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedLayout({ children }) {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-stone-500 text-body-lg">
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
        return 'Reading Stats'
      case '/profile':
        return 'Profile Settings'
      default:
        return 'Starlight Library'
    }
  }

  return (
    <div className="min-h-screen bg-background text-stone-800 selection:bg-rose-500 selection:text-white pastel-gradient-bg">
      {/* SideNavBar Component */}
      <aside className="fixed left-0 top-0 flex flex-col p-6 gap-8 z-40 h-screen w-72 bg-white border-r border-stone-100 shadow-[10px_0_40px_-20px_rgba(248,200,220,0.3)] hidden md:flex">
        <div className="mb-8">
          <h1 className="text-headline-lg text-rose-500">Starlight</h1>
          <p className="text-label-md text-stone-500 uppercase tracking-widest">Happy Reading!</p>
        </div>
        <nav className="flex-1 space-y-3">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-6 py-3 font-bold rounded-full transition-transform hover:translate-x-1 ${
              isActive('/dashboard')
                ? 'bg-rose-500 text-white'
                : 'text-stone-500 hover:bg-stone-100/50'
            }`}
          >
            <span className="material-symbols-outlined">auto_stories</span>
            <span className="text-body-lg">My Bookshelf</span>
          </Link>
          <Link
            to="/stats"
            className={`flex items-center gap-3 px-6 py-3 font-bold rounded-full transition-transform hover:translate-x-1 ${
              isActive('/stats')
                ? 'bg-rose-500 text-white'
                : 'text-stone-500 hover:bg-stone-100/50'
            }`}
          >
            <span className="material-symbols-outlined">stars</span>
            <span className="text-body-lg">Reading Goals</span>
          </Link>
          <Link
            to="/library"
            className={`flex items-center gap-3 px-6 py-3 font-bold rounded-full transition-transform hover:translate-x-1 ${
              isActive('/library')
                ? 'bg-rose-500 text-white'
                : 'text-stone-500 hover:bg-stone-100/50'
            }`}
          >
            <span className="material-symbols-outlined">local_florist</span>
            <span className="text-body-lg">Wishlist</span>
          </Link>
          <Link
            to="/profile"
            className={`flex items-center gap-3 px-6 py-3 font-bold rounded-full transition-transform hover:translate-x-1 ${
              isActive('/profile')
                ? 'bg-rose-500 text-white'
                : 'text-stone-500 hover:bg-stone-100/50'
            }`}
          >
            <span className="material-symbols-outlined">grade</span>
            <span className="text-body-lg">Star Reviews</span>
          </Link>
          <Link
            to="/profile"
            className={`flex items-center gap-3 px-6 py-3 font-bold rounded-full transition-transform hover:translate-x-1 ${
              isActive('/profile-club')
                ? 'bg-rose-500 text-white'
                : 'text-stone-500 hover:bg-stone-100/50'
            }`}
          >
            <span className="material-symbols-outlined">psychiatry</span>
            <span className="text-body-lg">Garden Club</span>
          </Link>
        </nav>
        <div className="mt-auto">
          <button
            onClick={() => navigate('/search')}
            className="w-full py-4 bg-rose-500 text-white rounded-full shadow-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Add New Book
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="md:ml-72 min-h-screen pb-24 md:pb-0">
        {/* TopAppBar Component */}
        <header className="sticky top-0 bg-background/80 backdrop-blur-md z-30 shadow-[0_10px_30px_-15px_rgba(248,200,220,0.4)]">
          <div className="flex items-center justify-between w-full h-20 max-w-[1440px] mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <h2 className="text-headline-md text-rose-500">{getHeaderTitle()}</h2>
            </div>
            <div className="flex items-center gap-6">
              {/* Search Bar */}
              <div className="hidden sm:flex items-center bg-white px-6 py-2 rounded-full border border-rose-500/30 shadow-sm w-72">
                <span className="material-symbols-outlined text-stone-500 text-sm">search</span>
                <input
                  className="bg-transparent border-none focus:ring-0 text-label-md w-full ml-2 text-stone-800 focus:outline-none"
                  placeholder="Find a story..."
                  type="text"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`)
                    }
                  }}
                />
              </div>
              <button className="text-stone-500 hover:bg-rose-500/30 transition-colors p-2 rounded-full cursor-pointer active:scale-95 transition-transform">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button
                onClick={() => navigate('/library')}
                className="text-stone-500 hover:bg-rose-500/30 transition-colors p-2 rounded-full cursor-pointer active:scale-95 transition-transform"
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
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-rose-500/20 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-rose-500/10">
                      <p className="text-label-md font-bold text-stone-800 truncate">{displayName}</p>
                      <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-label-md text-stone-800 hover:bg-rose-500/20 transition-colors w-full text-left"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      Profile
                    </Link>
                    <div className="h-[1px] bg-rose-500/10 my-1" />
                    <button
                      onClick={() => { handleLogout(); setProfileOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2 text-label-md text-red-600 hover:bg-red-50/20 transition-colors w-full text-left font-bold"
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
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-white shadow-[0_-10px_40px_-20px_rgba(248,200,220,0.3)] border-t border-rose-500/20 rounded-t-3xl">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center px-6 py-2 transition-all active:scale-95 ${
            isActive('/dashboard')
              ? 'bg-rose-500 text-white rounded-full shadow-sm'
              : 'text-stone-500 p-2 hover:text-rose-500'
          }`}
        >
          <span className="material-symbols-outlined">auto_stories</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Shelf</span>
        </Link>
        <Link
          to="/stats"
          className={`flex flex-col items-center justify-center px-6 py-2 transition-all active:scale-95 ${
            isActive('/stats')
              ? 'bg-rose-500 text-white rounded-full shadow-sm'
              : 'text-stone-500 p-2 hover:text-rose-500'
          }`}
        >
          <span className="material-symbols-outlined">stars</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Goals</span>
        </Link>
        <Link
          to="/library"
          className={`flex flex-col items-center justify-center px-6 py-2 transition-all active:scale-95 ${
            isActive('/library')
              ? 'bg-rose-500 text-white rounded-full shadow-sm'
              : 'text-stone-500 p-2 hover:text-rose-500'
          }`}
        >
          <span className="material-symbols-outlined">local_florist</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Wish</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center px-6 py-2 transition-all active:scale-95 ${
            isActive('/profile')
              ? 'bg-rose-500 text-white rounded-full shadow-sm'
              : 'text-stone-500 p-2 hover:text-rose-500'
          }`}
        >
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Me</span>
        </Link>
      </nav>
    </div>
  )
}
