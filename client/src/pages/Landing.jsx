import { Link } from 'react-router-dom'
import { createElement } from 'react'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Library,
  Mail,
  NotebookPen,
  Search,
  Share2,
  Star
} from 'lucide-react'
import logoImage from '../assets/Black Logo.png'
import heroImage from '../assets/ReadList Hero Image.jpg'
import bookCoverImage from '../assets/Bookcover.jpg'
import styles from './Landing.module.css'

// short capability labels shown in the strip under the hero
// kept honest (no invented user counts) since ReadList has no live users yet
const highlights = [
  { icon: Library, title: 'Personal Library', text: 'Every book in one place' },
  { icon: NotebookPen, title: 'Session Logging', text: 'Track pages as you read' },
  { icon: BarChart3, title: 'Reading Stats', text: 'Streaks and monthly pace' },
  { icon: Search, title: 'Quick Add', text: 'Search and add in seconds' }
]

const features = [
  {
    icon: BarChart3,
    title: 'Visual Progress',
    text: 'Watch your pace take shape through simple, tactile charts of your streaks and monthly totals.',
    mock: 'chart'
  },
  {
    icon: NotebookPen,
    title: 'Reading Notes',
    text: 'Jot a quick note after every session so the moments that stood out do not fade.',
    mock: 'notes'
  },
  {
    icon: Library,
    title: 'Curated Shelves',
    text: 'Organize want to read, currently reading, and finished titles into shelves that make sense to you.',
    mock: 'stack'
  }
]

const previewPoints = [
  'One tap progress tracking',
  'Quick notes after every session',
  'Cross device sync with your account'
]

// fictional reader personas standing in for testimonials until real ones are collected
const testimonials = [
  {
    quote: 'ReadList turned my scattered reading list into one calm shelf. Logging a session takes seconds.',
    name: 'Amara N.',
    role: 'Book Club Organizer'
  },
  {
    quote: 'The stats page is the first tracker I have used that actually makes me want to keep my streak going.',
    name: 'Brian K.',
    role: 'Graduate Student'
  },
  {
    quote: 'Search and add is genuinely fast. I dropped my old spreadsheet within a week.',
    name: 'Wanjiru M.',
    role: 'Casual Reader'
  }
]

export default function Landing() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand} aria-label="ReadList home">
            <img src={logoImage} alt="" className={styles.brandLogo} />
            ReadList
          </Link>

          <nav className={styles.nav} aria-label="Landing navigation">
            <a href="#features" className={styles.navActive}>Features</a>
            <a href="#preview">Preview</a>
            <a href="#testimonials">Community</a>
          </nav>

          <div className={styles.headerActions}>
            <Link to="/login" className={styles.loginLink}>Sign In</Link>
            <Link to="/signup" className={styles.headerCta}>Start Reading</Link>
          </div>
        </div>
      </header>

      <main>
        {/* hero: headline, two CTAs, and a photo with a floating progress card */}
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <h1>Your reading journey, <em>beautifully chronicled.</em></h1>
            <p className={styles.heroLead}>
              A calm home for the modern reader. Track your pace, log every
              session, and keep a shelf that reflects what you actually read.
            </p>
            <div className={styles.heroActions}>
              <Link to="/signup" className={styles.primaryCta}>
                Start Your Library <ArrowRight size={17} />
              </Link>
              <a href="#features" className={styles.secondaryCta}>Explore Features</a>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroPhotoFrame}>
              <img src={heroImage} alt="ReadList" />
            </div>
            <div className={styles.floatingCard}>
              <div className={styles.floatingCardHead}>
                <BookOpen size={18} />
              </div>
            </div>
          </div>
        </section>

        {/* honest capability strip, replaces the usual fabricated stats bar */}
        <section className={styles.highlights}>
          <div className={styles.highlightsGrid}>
            {highlights.map(({ icon: Icon, title, text }) => (
              <div className={styles.highlightItem} key={title}>
                <div className={styles.highlightIcon}>
                  {createElement(Icon, { size: 18 })}
                </div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* features bento grid, each card paired with a small visual mockup */}
        <section className={styles.features} id="features">
          <div className={styles.sectionHead}>
            <h2>Designed for Intention</h2>
            <p>Tools that stay out of the way, leaving only you and the page you are on.</p>
          </div>
          <div className={styles.featureGrid}>
            {features.map(({ icon: Icon, title, text, mock }, index) => (
              <article
                className={`${styles.featureCard} ${index === 1 ? styles.featureCardRaised : ''}`}
                key={title}
              >
                <div className={styles.featureIconWrap}>
                  {createElement(Icon, { size: 20 })}
                </div>
                <h3>{title}</h3>
                <p>{text}</p>

                {mock === 'chart' && (
                  <div className={styles.chartMock}>
                    {[40, 70, 55, 90, 65].map((height, i) => (
                      <span key={i} style={{ height: `${height}%` }} />
                    ))}
                  </div>
                )}
                {mock === 'notes' && (
                  <div className={styles.notesMock}>
                    <span />
                    <span />
                    <span />
                  </div>
                )}
                {mock === 'stack' && (
                  <div className={styles.stackMock}>
                    <span />
                    <span />
                    <span />
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* interface preview: copy on the left, a mock book detail card on the right */}
        <section className={styles.preview} id="preview">
          <div className={styles.previewPanel}>
            <div className={styles.previewCopy}>
              <span className={styles.previewBadge}>Interface Preview</span>
              <h2>Focus on the Narrative</h2>
              <p>
                Generous whitespace and minimal typography keep your books at the
                center. No cluttered dashboards, just you and your progress.
              </p>
              <ul className={styles.previewList}>
                {previewPoints.map((point) => (
                  <li key={point}>
                    <CheckCircle2 size={17} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.previewVisual}>
              <div className={styles.bookDetailCard}>
                <img src={bookCoverImage} alt="The Gilded Mirror book cover" className={styles.bookCoverBlock} />
                <h4>The Gilded Mirror</h4>
                <p className={styles.author}>K E Barden</p>
                <div className={styles.bookStats}>
                  <span>Reading Progress</span>
                  <span>182 / 240 pages</span>
                </div>
                <div className={styles.progressTrack}>
                  <span style={{ width: '75%' }} />
                </div>
                <p className={styles.note}>
                  &ldquo;Every mirror tells the truth, it just waits for you to be ready.&rdquo;
                </p>
                <p className={styles.noteMeta}>Recent Note, 2 mins ago</p>
              </div>
            </div>
          </div>
        </section>

        {/* testimonials use fictional placeholder reviewers until real ones exist */}
        <section className={styles.testimonials} id="testimonials">
          <div className={styles.testimonialsHead}>
            <div>
              <h2>Community Highlights</h2>
              <p>Early feedback from readers trying out ReadList.</p>
            </div>
            <a href="#" className={styles.seeAll}>
              See All Stories <ArrowRight size={16} />
            </a>
          </div>
          <div className={styles.testimonialGrid}>
            {testimonials.map(({ quote, name, role }) => (
              <article className={styles.testimonialCard} key={name}>
                <div className={styles.stars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" stroke="none" />
                  ))}
                </div>
                <blockquote>{quote}</blockquote>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.avatar} />
                  <div>
                    <strong>{name}</strong>
                    <span>{role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.finalCta}>
          <div className={styles.finalCtaInner}>
            <h2>Turn the Page to Your Next Chapter</h2>
            <p>Start your reading library today and see how ReadList helps you keep track of every book.</p>
            <Link to="/signup" className={styles.finalCtaButton}>
              Get Started for Free <ArrowRight size={18} />
            </Link>
            <small>No credit card required. Sync across all your devices.</small>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <strong>ReadList</strong>
            <p>A warm, organized home for your books, pages, and reading habits.</p>
          </div>

          <div className={styles.footerLinks}>
            <a href="#features">Features</a>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Log In</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>

          <div className={styles.footerSocial}>
            <a href="#" aria-label="Share ReadList">
              <Share2 size={17} />
            </a>
            <a href="#" aria-label="Email ReadList">
              <Mail size={17} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}