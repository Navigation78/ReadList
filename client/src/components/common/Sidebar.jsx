import { Link, useLocation } from 'react-router-dom'
import { createElement } from 'react'
import { Home, BookMarked, Search, BarChart2, Settings, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import logo from '../../assets/Black Logo.png'

const MENU_ITEMS = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/library', icon: BookMarked, label: 'Library' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/stats', icon: BarChart2, label: 'Stats' }
]

const OTHER_ITEMS = [
  { to: '/profile', icon: Settings, label: 'Settings' },
  { to: '/profile', icon: HelpCircle, label: 'Help' }
]

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation()
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`)

  return (
    <nav
      className={`relative h-screen sticky top-0 flex flex-col bg-white border-r border-stone-200 transition-all duration-200 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* toggle button, sits on the edge of the sidebar */}
      <button
        onClick={onToggle}
        title={collapsed ? 'Expand' : 'Collapse'}
        className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-rose-500 hover:border-rose-300 transition"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* brand */}
      <div className="flex items-center gap-3 px-5 h-20 border-b border-stone-100">
        <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
          <img src={logo} alt="ReadList" className="w-full h-full object-cover" />
        </div>
        {!collapsed && <span className="font-display text-base font-semibold text-stone-900">ReadList</span>}
      </div>

      {/* menu section */}
      <div className="flex-1 px-3 pt-6">
        {!collapsed && (
          <span className="block px-3 mb-2 text-xs font-medium tracking-wide text-stone-400">
            MENU
          </span>
        )}
        <div className="flex flex-col gap-1">
          {MENU_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = isActive(to)
            return (
              <Link
                key={to + label}
                to={to}
                title={collapsed ? label : undefined}
                className={`relative flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? 'bg-rose-100 text-rose-700'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {createElement(Icon, { size: 18, className: active ? 'text-rose-600' : 'text-stone-500' })}
                {!collapsed && <span>{label}</span>}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-rose-400 rounded-r" />
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* others section */}
      <div className="px-3 pb-6">
        {!collapsed && (
          <span className="block px-3 mb-2 text-xs font-medium tracking-wide text-stone-400">
            OTHERS
          </span>
        )}
        <div className="flex flex-col gap-1">
          {OTHER_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to && label === 'Settings'
            return (
              <Link
                key={to + label}
                to={to}
                title={collapsed ? label : undefined}
                className={`flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? 'bg-rose-100 text-rose-700'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {createElement(Icon, { size: 18, className: active ? 'text-rose-600' : 'text-stone-500' })}
                {!collapsed && <span>{label}</span>}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}