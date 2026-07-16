import { Link } from 'react-router-dom'
import { createElement } from 'react'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Library,
  NotebookPen,
  Sparkles,
  Star,
  Sun,
  Moon,
  Zap
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import logoImage from '../assets/ReadList Icon.png'
import heroImage from '../assets/ReadList Hero Image.jpg'
import bookCoverImage from '../assets/Bookcover.jpg'
import searchLight from '../assets/Search Light Mode.png'
import searchDark from '../assets/Search Dark Mode.png'
import libraryLight from '../assets/Library Light Mode.png'
import libraryDark from '../assets/Library Dark Mode.png'
import analyticsLight from '../assets/Analytics Light Mode.png'
import analyticsDark from '../assets/Analytics Dark Mode.png'

// short capability labels under the hero, kept honest since ReadList has no live users yet
const highlights = [
  { icon: Library, title: 'Personal Library', text: 'Every book in one place', tint: 'rose' },
  { icon: NotebookPen, title: 'Session Logging', text: 'Track pages as you read', tint: 'lavender' },
  { icon: BarChart3, title: 'Reading Stats', text: 'Streaks and monthly pace', tint: 'mint' },
  { icon: Zap, title: 'Quick Add', text: 'Search and add in seconds', tint: 'rose' }
]

// real product screenshots, one light/dark pair per feature, shown in the features section below
const featureShowcase = [
  {
    badge: 'Book Search',
    heading: 'Find Your Next Read',
    text: 'Search a huge open catalog by title, author, or ISBN and add any book to your shelves in a single tap.',
    points: ['Instant results as you type', 'One-tap add straight to your library', 'No manual data entry required'],
    tint: 'rose',
    lightImg: searchLight,
    darkImg: searchDark
  },
  {
    badge: 'My Library',
    heading: 'One Shelf for Every Book',
    text: 'Every title you own or want to read lives in one place, sorted into Reading, Want to Read, and Finished.',
    points: ['Three shelves that mirror how you actually read', 'Covers pulled in automatically', 'Collection size always visible at a glance'],
    tint: 'lavender',
    lightImg: libraryLight,
    darkImg: libraryDark
  },
  {
    badge: 'Reading Analytics',
    heading: 'Know Your Reading Habits',
    text: 'A dedicated stats page turns your reading history into a clear picture of pace, progress, and habits.',
    points: ['Books finished this year at a glance', 'Running total of every book you have finished', 'Books-per-month trend so you can spot your pace'],
    tint: 'mint',
    lightImg: analyticsLight,
    darkImg: analyticsDark
  }
]

const previewPoints = [
  'Distraction free progress tracking',
  'Beautiful book centric aesthetics',
  'One tap session logging'
]

// fictional reader personas standing in for testimonials until real ones are collected
const testimonials = [
  { quote: 'ReadList turned my scattered reading list into one calm shelf.', name: 'Amara N.', tint: 'rose' },
  { quote: 'The stats page is the first tracker that actually makes me want to keep my streak going.', name: 'Brian K.', tint: 'lavender' },
  { quote: 'Search and add is genuinely fast. I dropped my old spreadsheet within a week.', name: 'Wanjiru M.', tint: 'mint' }
]

// background dot pattern used across the page, kept as one shared style object
const doodleBg = {
  backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(121, 84, 101, 0.06) 1px, transparent 0)',
  backgroundSize: '36px 36px'
}

// Full literal class names per tint so Tailwind's JIT scanner can find them.
// (Building class names via template strings like `bg-${tint}-100` silently
// drops the utility from the build since Tailwind never sees the full string.)
const tintClasses = {
  rose: { bg100: 'bg-rose-100', text500: 'text-rose-500', text600: 'text-rose-600', border100: 'border-rose-100' },
  lavender: { bg100: 'bg-lavender-100', text500: 'text-lavender-500', text600: 'text-lavender-600', border100: 'border-lavender-100' },
  mint: { bg100: 'bg-mint-100', text500: 'text-mint-500', text600: 'text-mint-600', border100: 'border-mint-100' }
}

export default function Landing() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-body" style={doodleBg}>
      {/* header */}
      <header className="sticky top-0 z-50 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md shadow-[0_8px_30px_rgba(248,200,220,0.35)] dark:shadow-none">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl font-bold text-rose-500">
            <img src={logoImage} alt="" className="h-10 w-auto dark:invert" />
            ReadList
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="text-rose-500 font-bold border-b-2 border-rose-200 pb-1">Features</a>
            <a href="#preview" className="text-stone-800 dark:text-stone-300 hover:text-rose-500 transition">Preview</a>
            <a href="#testimonials" className="text-stone-800 dark:text-stone-300 hover:text-rose-500 transition">Community</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="text-stone-600 dark:text-stone-300 hover:text-rose-500 transition p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link
              to="/login"
              className="bg-rose-200 text-rose-700 px-6 py-2 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-rose-200/60 active:scale-95 transition-all"
            >
              Start Reading
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* hero */}
        <section className="relative max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 flex flex-col items-start gap-5 z-10">
            <span className="bg-lavender-100 text-lavender-600 px-4 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-2">
              <Sparkles size={14} /> Your Personal Sanctuary
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-rose-500 leading-tight">
              Your reading journey, <span className="italic font-light">beautifully</span> chronicled.
            </h1>
            <p className="text-lg text-stone-800 dark:text-stone-300 max-w-lg leading-relaxed">
              A calm home for the modern reader. Track your pace, log every
              session, and keep a shelf that reflects what you actually read.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/login"
                className="bg-rose-500 text-white px-8 py-4 rounded-lg font-display font-semibold shadow-[0_10px_30px_-5px_rgba(121,84,101,0.4)] hover:scale-105 active:scale-95 transition-all"
              >
                Start Your Library
              </Link>
              <a
                href="#features"
                className="bg-lavender-100 text-lavender-600 px-8 py-4 rounded-lg font-display font-semibold hover:bg-lavender-200 active:scale-95 transition-all"
              >
                Explore Features
              </a>
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="absolute -z-10 bg-rose-200/20 w-full h-full rounded-3xl blur-3xl rotate-3" />
            <div
              className="rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(248,200,220,0.5)]"
              style={{ animation: 'float 6s ease-in-out infinite' }}
            >
              <img src={heroImage} alt="ReadList" className="w-full h-auto object-cover" />
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-stone-900 p-5 rounded-2xl shadow-xl max-w-[220px] border-4 border-rose-100 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-mint-100 flex items-center justify-center text-mint-600">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900 dark:text-stone-100">Book Finished!</p>
                  <p className="text-[10px] text-stone-800 dark:text-stone-300">420 pages, 12 days</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* honest capability strip */}
        <section className="bg-white dark:bg-stone-900 py-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between gap-8">
            {highlights.map(({ icon: Icon, title, text, tint }) => (
              <div className="flex items-center gap-4 group" key={title}>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${tintClasses[tint].bg100} ${tintClasses[tint].text500}`}
                >
                  {createElement(Icon, { size: 20 })}
                </div>
                <div>
                  <p className={`font-display text-sm font-semibold ${tintClasses[tint].text500}`}>{title}</p>
                  <p className="text-xs text-stone-800 dark:text-stone-300">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* features showcase, real product screenshots swapped to match the active theme */}
        <section className="max-w-7xl mx-auto px-6 py-20" id="features">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-rose-500 mb-3">Every detail, considered.</h2>
            <p className="text-stone-800 dark:text-stone-300 max-w-2xl mx-auto">
              Thoughtfully designed features that celebrate your reading life without adding clutter.
            </p>
          </div>

          <div className="flex flex-col gap-24">
            {featureShowcase.map(({ badge, heading, text, points, tint, lightImg, darkImg }, i) => (
              <div
                key={badge}
                className={`flex flex-col lg:flex-row items-center gap-12 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className="lg:w-1/2 relative">
                  <div
                    className={`absolute -z-10 w-full h-full rounded-3xl blur-3xl opacity-40 ${tintClasses[tint].bg100} ${i % 2 === 1 ? '-rotate-3' : 'rotate-3'}`}
                  />
                  <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-1.5 px-4 py-3 bg-stone-100 dark:bg-stone-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-300" />
                      <span className="w-2.5 h-2.5 rounded-full bg-lavender-300" />
                      <span className="w-2.5 h-2.5 rounded-full bg-mint-300" />
                    </div>
                    <div className="h-[380px] overflow-hidden">
                      <img
                        src={theme === 'dark' ? darkImg : lightImg}
                        alt={`${heading} in the ReadList app`}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2 flex flex-col gap-4">
                  <span
                    className={`w-fit px-4 py-1 rounded-full text-xs font-bold ${tintClasses[tint].bg100} ${tintClasses[tint].text600}`}
                  >
                    {badge}
                  </span>
                  <h3 className={`font-display text-2xl font-semibold ${tintClasses[tint].text500}`}>{heading}</h3>
                  <p className="text-stone-800 dark:text-stone-300 leading-relaxed">{text}</p>
                  <ul className="space-y-3 mt-2">
                    {points.map((point) => (
                      <li key={point} className="flex items-center gap-3 text-stone-700 dark:text-stone-300 text-sm">
                        <CheckCircle2 className={tintClasses[tint].text500} size={18} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* interface preview, book detail card mockup using the real cover image */}
        <section className="bg-white dark:bg-stone-900 py-20" id="preview">
          <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="font-display text-4xl font-bold text-rose-500 mb-5">Focus on the Narrative</h2>
              <p className="text-lg text-stone-800 dark:text-stone-300 mb-8 leading-relaxed">
                Generous whitespace and minimal typography keep your books at the center. No distractions,
                just you and your stories.
              </p>
              <ul className="space-y-4">
                {previewPoints.map((point) => (
                  <li className="flex items-center gap-3 text-stone-700 dark:text-stone-300" key={point}>
                    <CheckCircle2 className="text-rose-500" size={20} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:w-1/2 relative flex justify-center">
              <div className="absolute -top-8 -right-8 w-28 h-28 bg-rose-200/30 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-mint-200/30 rounded-full blur-3xl" />

              <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] w-full max-w-md border border-stone-100 rotate-1 relative z-10">
                <div className="flex items-start gap-5 mb-8">
                  <img
                    src={bookCoverImage}
                    alt="The Gilded Mirror book cover"
                    className="w-28 h-40 rounded-xl object-cover shadow-lg flex-shrink-0"
                  />
                  <div className="flex flex-col h-40 justify-between">
                    <div>
                      <h4 className="font-display text-lg font-semibold text-rose-500 leading-tight">The Gilded Mirror</h4>
                      <p className="text-stone-800 dark:text-stone-300 text-sm">K E Barden</p>
                    </div>
                    <div className="bg-lavender-100 rounded-full px-4 py-2 text-xs font-bold text-lavender-600 flex items-center gap-2 w-fit">
                      <Clock size={14} /> In Progress
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-sm font-bold text-stone-800 dark:text-stone-300">182 of 240 pages</p>
                    <p className="text-sm font-bold text-rose-500">75%</p>
                  </div>
                  <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-300 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-xl">
                    <p className="text-[10px] uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">Started</p>
                    <p className="text-sm font-bold text-stone-800 dark:text-stone-300">Jul 2, 2026</p>
                  </div>
                  <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-xl">
                    <p className="text-[10px] uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">Est. Finish</p>
                    <p className="text-sm font-bold text-stone-800 dark:text-stone-300">In 3 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* testimonials, fictional placeholder reviewers until real ones exist */}
        <section className="max-w-7xl mx-auto px-6 py-20" id="testimonials">
          <h2 className="font-display text-3xl font-bold text-rose-500 text-center mb-14">Loved by Bookworms</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ quote, name, tint }) => (
              <div
                key={name}
                className={`bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-xl border ${tintClasses[tint].border100} flex flex-col gap-4`}
              >
                <div className={`flex ${tintClasses[tint].text500}`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" stroke="none" />
                  ))}
                </div>
                <p className="italic text-stone-800 dark:text-stone-300">{quote}</p>
                <div className="mt-auto pt-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${tintClasses[tint].bg100}`} />
                  <p className={`font-bold ${tintClasses[tint].text600}`}>{name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* final cta */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="bg-rose-200 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl shadow-rose-200/40">
            <h2 className="font-display text-4xl font-bold text-rose-700 mb-5 relative z-10">
              Turn the Page to Your Next Chapter
            </h2>
            <p className="text-rose-700/80 text-lg mb-8 max-w-xl mx-auto relative z-10">
              Start your reading library today and see how ReadList helps you keep track of every book.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-rose-500 text-white px-10 py-5 rounded-lg font-display font-semibold shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10"
            >
              Get Started for Free <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {/* footer */}
      <footer className="bg-white dark:bg-stone-900 rounded-t-3xl">
        <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-rose-500">
            <BookOpen size={20} /> ReadList
          </div>
          <div className="flex gap-8 flex-wrap justify-center text-sm">
            <Link to="/privacy" className="text-stone-800 dark:text-stone-300 hover:text-rose-500 transition">Privacy</Link>
            <Link to="/terms" className="text-stone-800 dark:text-stone-300 hover:text-rose-500 transition">Terms</Link>
            <Link to="/login" className="text-stone-800 dark:text-stone-300 hover:text-rose-500 transition">Log In</Link>
            <Link to="/signup" className="text-stone-800 dark:text-stone-300 hover:text-rose-500 transition">Sign Up</Link>
          </div>
          <p className="text-stone-600 dark:text-stone-400 text-sm text-center">© 2026 ReadList. Made for readers who love a little whimsy.</p>
        </div>
      </footer>
    </div>
  )
}