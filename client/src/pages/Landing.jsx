import { Link } from 'react-router-dom'
import { createElement } from 'react'
import {
  ArrowRight,
  BarChart3,
  BookMarked,
  BookOpen,
  CheckCircle2,
  Clock3,
  Library,
  Search,
  Sparkles,
  TrendingUp
} from 'lucide-react'
import logoImage from '../assets/Black Logo.png'
import bookImage from '../assets/images (4).jpg'
import styles from './Landing.module.css'

const features = [
  {
    icon: Library,
    title: 'A library with memory',
    text: 'Sort books into want to read, currently reading, and finished without losing the thread.'
  },
  {
    icon: Clock3,
    title: 'Progress that stays visible',
    text: 'Track pages, sessions, and active reads so every small pocket of reading counts.'
  },
  {
    icon: BarChart3,
    title: 'Stats for better habits',
    text: 'See streaks, pages, genres, and monthly momentum in one warm, readable dashboard.'
  }
]

const steps = [
  'Search or add a book',
  'Move it into your list',
  'Log sessions and pages',
  'Watch your reading grow'
]

export default function Landing() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand} aria-label="ReadList home">
          <img src={logoImage} alt="" className={styles.brandLogo} />
          <span>ReadList</span>
        </Link>

        <nav className={styles.nav} aria-label="Landing navigation">
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <a href="#preview">Preview</a>
        </nav>

        <div className={styles.headerActions}>
          <Link to="/login" className={styles.loginLink}>Log In</Link>
          <Link to="/signup" className={styles.headerCta}>Get Started</Link>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={styles.kicker}>
              <Sparkles size={15} />
              Your personal reading tracker
            </div>
            <h1>Track every book, page, and reading habit in one quiet place.</h1>
            <p>
              Build your personal library, follow progress across active books,
              log reading sessions, and see your reading life grow over time.
            </p>
            <div className={styles.heroActions}>
              <Link to="/signup" className={styles.primaryCta}>
                Start Reading <ArrowRight size={18} />
              </Link>
              <Link to="/login" className={styles.secondaryCta}>I already have an account</Link>
            </div>
            <div className={styles.trustRow} aria-label="ReadList highlights">
              <span><CheckCircle2 size={16} /> Progress tracking</span>
              <span><CheckCircle2 size={16} /> Reading stats</span>
              <span><CheckCircle2 size={16} /> Book search</span>
            </div>
          </div>

          <div className={styles.heroVisual} aria-label="ReadList product preview">
            <img src={bookImage} alt="Open book illustration" className={styles.bookArt} />
            <div className={styles.previewShell}>
              <div className={styles.previewTop}>
                <span />
                <span />
                <span />
              </div>
              <div className={styles.previewGrid}>
                <div className={styles.metricWide}>
                  <div>
                    <small>Books Finished</small>
                    <strong>24</strong>
                  </div>
                  <TrendingUp size={19} />
                </div>
                <div className={styles.metric}>
                  <small>Streak</small>
                  <strong>12 days</strong>
                </div>
                <div className={styles.bookStack}>
                  <div className={styles.bookCover} />
                  <div>
                    <small>Currently Reading</small>
                    <strong>The Quiet Page</strong>
                    <div className={styles.progressTrack}>
                      <span style={{ width: '68%' }} />
                    </div>
                  </div>
                </div>
                <div className={styles.chartPreview}>
                  {[42, 70, 48, 86, 62, 96].map((height, index) => (
                    <span key={index} style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.featureBand} id="features">
          <div className={styles.sectionHeading}>
            <span>What ReadList keeps together</span>
            <h2>A calmer way to manage your reading life.</h2>
          </div>
          <div className={styles.featureGrid}>
            {features.map(({ icon: Icon, title, text }) => (
              <article className={styles.featurePanel} key={title}>
                <div className={styles.featureIcon}>
                  {createElement(Icon, { size: 22 })}
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.workflow} id="workflow">
          <div className={styles.workflowImage}>
            <img src={logoImage} alt="ReadList flower book logo" />
          </div>
          <div className={styles.workflowCopy}>
            <span>Simple workflow</span>
            <h2>From wishlist to finished shelf, every step has a home.</h2>
            <div className={styles.steps}>
              {steps.map((step, index) => (
                <div className={styles.step} key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.previewBand} id="preview">
          <div className={styles.sectionHeading}>
            <span>Product preview</span>
            <h2>Built for readers who like seeing the whole shelf.</h2>
          </div>
          <div className={styles.previewCards}>
            <article className={styles.productPanel}>
              <BookOpen size={24} />
              <h3>Active Reads</h3>
              <p>Keep current books close, with page progress and quick status changes.</p>
            </article>
            <article className={styles.productPanel}>
              <Search size={24} />
              <h3>Book Search</h3>
              <p>Find titles through book search and add them to your personal list.</p>
            </article>
            <article className={styles.productPanel}>
              <BookMarked size={24} />
              <h3>Finished Shelf</h3>
              <p>Review completed books, total pages, and long-term reading momentum.</p>
            </article>
          </div>
        </section>

        <section className={styles.finalCta}>
          <img src={bookImage} alt="" />
          <div>
            <h2>Your next chapter deserves a place to live.</h2>
            <p>Start a library that remembers what you read, when you read, and where you are headed next.</p>
          </div>
          <Link to="/signup" className={styles.primaryCta}>
            Create Your ReadList <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <img src={logoImage} alt="" />
          <div>
            <strong>ReadList</strong>
            <p>A warm, organized home for your books, pages, and reading habits.</p>
          </div>
        </div>
        <div className={styles.footerGrid}>
          <div>
            <span>Product</span>
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#preview">Preview</a>
          </div>
          <div>
            <span>Account</span>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Log In</Link>
          </div>
          <div>
            <span>Legal</span>
            <Link to="/terms">Terms of Use</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <small>Copyright 2026 ReadList. All rights reserved.</small>
          <small>Made for readers who like a little order with their wonder.</small>
        </div>
      </footer>
    </div>
  )
}
