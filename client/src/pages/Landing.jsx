import { Link } from 'react-router-dom'
import { createElement } from 'react'
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Library,
  LineChart,
  NotebookPen,
  Search,
  Sparkles
} from 'lucide-react'
import logoImage from '../assets/Black Logo.png'
import bookImage from '../assets/images (4).jpg'
import styles from './Landing.module.css'

const features = [
  {
    icon: Library,
    title: 'A library with memory',
    text: 'Sort books into want to read, currently reading, and finished, without losing the thread.'
  },
  {
    icon: NotebookPen,
    title: 'Progress that stays visible',
    text: 'Log sessions and pages so every pocket of reading counts toward something.'
  },
  {
    icon: LineChart,
    title: 'Stats for better habits',
    text: 'See streaks, pages, and monthly momentum in one warm, readable dashboard.'
  }
]

const steps = [
  'Search or add a book',
  'Move it into your list',
  'Log sessions and pages',
  'Watch your reading grow'
]

const shelves = [
  {
    icon: BookOpen,
    code: 'LC-001',
    title: 'Active Reads',
    text: 'Keep current books close, with page progress and quick status changes.'
  },
  {
    icon: Search,
    code: 'LC-002',
    title: 'Book Search',
    text: 'Find titles through book search and add them to your personal list.'
  },
  {
    icon: Bookmark,
    code: 'LC-003',
    title: 'Finished Shelf',
    text: 'Review completed books, total pages, and long term reading momentum.'
  }
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
              <Sparkles size={14} />
              No. 01 · Personal Library System
            </div>
            <h1>A library that remembers where you left off.</h1>
            <p>
              Keep every book, every page, and every reading streak in one calm,
              well kept shelf. Add a title, log a session, and watch the shelf fill in.
            </p>
            <div className={styles.heroActions}>
              <Link to="/signup" className={styles.primaryCta}>
                Start Your Shelf <ArrowRight size={18} />
              </Link>
              <Link to="/login" className={styles.secondaryCta}>I already have an account</Link>
            </div>
            <div className={styles.trustRow} aria-label="ReadList highlights">
              <span><CheckCircle2 size={15} /> Progress tracking</span>
              <span><CheckCircle2 size={15} /> Reading stats</span>
              <span><CheckCircle2 size={15} /> Book search</span>
            </div>
          </div>

          <div className={styles.heroVisual} aria-label="ReadList product preview">
            <div className={styles.ledger}>
              <div className={styles.ledgerTop}>
                <span>Reading Ledger</span>
                <span>Up To Date</span>
              </div>
              <div className={styles.ledgerGrid}>
                <div className={styles.metricWide}>
                  <div>
                    <small>Books Finished</small>
                    <strong>24</strong>
                  </div>
                  <LineChart size={18} />
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
            <span>What The Shelf Keeps</span>
            <h2>A calmer way to manage your reading life.</h2>
          </div>
          <div className={styles.featureGrid}>
            {features.map(({ icon: Icon, title, text }) => (
              <article className={styles.featurePanel} key={title}>
                <div className={styles.featureIcon}>
                  {createElement(Icon, { size: 21 })}
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
            <span>Simple Workflow</span>
            <h2>From wishlist to finished shelf, every step has a home.</h2>
            <div className={styles.steps}>
              {steps.map((step, index) => (
                <div className={styles.step} key={step}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.previewBand} id="preview">
          <div className={styles.sectionHeading}>
            <span>The Reading Room</span>
            <h2>Built for readers who like seeing the whole shelf.</h2>
          </div>
          <div className={styles.previewCards}>
            {shelves.map(({ icon: Icon, code, title, text }) => (
              <article className={styles.productPanel} key={code}>
                {createElement(Icon, { size: 22 })}
                <span className={styles.catalogCode}>{code}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.finalCta}>
          <img src={bookImage} alt="" />
          <div>
            <h2>Your next chapter deserves a shelf.</h2>
            <p>Start a library that remembers what you read, when you read it, and where you are headed next.</p>
          </div>
          <Link to="/signup" className={styles.primaryCta}>
            Create Your Shelf <ArrowRight size={18} />
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