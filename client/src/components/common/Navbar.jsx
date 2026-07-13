import { Link } from 'react-router-dom'
import logoImage from '../../assets/Black Logo.png'

// pass a custom links array for pages that don't have on-page sections to jump to (like Legal)
const defaultLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#preview', label: 'Preview' },
  { href: '/#testimonials', label: 'Community' }
]

export default function Navbar({ links = defaultLinks }) {
  return (
    <header className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur-md shadow-[0_8px_30px_rgba(248,200,220,0.35)]">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-rose-500">
          <img src={logoImage} alt="" className="w-8 h-8 rounded-lg object-cover" />
          ReadList
        </Link>

        {links.length > 0 && (
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {links.map(({ href, label }) => (
              <a key={href} href={href} className="text-stone-500 hover:text-rose-500 transition">
                {label}
              </a>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:inline text-sm font-medium text-stone-500 hover:text-rose-500 transition">
            Log In
          </Link>
          <Link
            to="/signup"
            className="bg-rose-200 text-rose-700 px-6 py-2 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-rose-200/60 active:scale-95 transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  )
}