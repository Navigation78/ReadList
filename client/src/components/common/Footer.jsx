import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

// pass activePath (e.g. "/terms") to bold the current page's link, used by the Legal page
export default function Footer({ activePath }) {
  const linkClass = (path) =>
    activePath === path ? 'text-rose-500 font-bold' : 'text-stone-500 hover:text-rose-500 transition'

  return (
    <footer className="bg-white rounded-t-3xl">
      <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 font-display text-lg font-semibold text-rose-500">
          <BookOpen size={20} /> ReadList
        </div>
        <p className="text-stone-500 text-sm text-center max-w-sm">
          Book tracking, reading progress, and habits in one organized place.
        </p>
        <div className="flex gap-8 flex-wrap justify-center text-sm">
          <Link to="/" className={linkClass('/')}>Home</Link>
          <Link to="/terms" className={linkClass('/terms')}>Terms of Use</Link>
          <Link to="/privacy" className={linkClass('/privacy')}>Privacy Policy</Link>
        </div>
        <p className="text-stone-400 text-xs text-center">© 2026 ReadList. Made for readers who love a little whimsy.</p>
      </div>
    </footer>
  )
}