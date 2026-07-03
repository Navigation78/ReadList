import { Link } from 'react-router-dom'
import logoImage from '../assets/Black Logo.png'
import styles from './LegalPage.module.css'

const content = {
  terms: {
    title: 'Terms of Use',
    intro: 'These terms describe how ReadList should be used. This page is a project-friendly placeholder and should be reviewed before production use.',
    sections: [
      ['Use of ReadList', 'ReadList is designed to help you track books, reading sessions, progress, and personal reading statistics. You agree to use it only for lawful, respectful purposes.'],
      ['Your account', 'You are responsible for keeping your login credentials secure and for the activity that happens through your account.'],
      ['Your content', 'Book notes, reading sessions, and profile information remain your content. You grant ReadList the limited permission needed to store and show that content inside your account.'],
      ['Service changes', 'ReadList may change features, improve workflows, or remove outdated functionality as the project evolves.'],
      ['No guarantee', 'ReadList is provided as is, without promises that it will always be uninterrupted, error free, or available in every environment.']
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    intro: 'This policy explains the data ReadList expects to handle. It is a clear placeholder for this project and should be reviewed before production use.',
    sections: [
      ['Information you provide', 'ReadList may store your email address, profile details, books, reading progress, notes, and reading session history.'],
      ['How information is used', 'Your information is used to authenticate your account, display your library, calculate reading statistics, and maintain your reading history.'],
      ['Storage and services', 'ReadList uses Supabase for authentication and database storage. Data is handled according to the security settings configured for the project.'],
      ['Your choices', 'You can update your profile information and manage books or sessions from inside the app. Account deletion workflows should be added before production launch.'],
      ['Contact', 'For privacy questions, add a project support email here before publishing ReadList publicly.']
    ]
  }
}

export default function LegalPage({ type = 'terms' }) {
  const page = content[type] || content.terms

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          <img src={logoImage} alt="" />
          <span>ReadList</span>
        </Link>
        <nav>
          <Link to="/login">Log In</Link>
          <Link to="/signup" className={styles.cta}>Get Started</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <p className={styles.eyebrow}>Legal</p>
        <h1>{page.title}</h1>
        <p className={styles.intro}>{page.intro}</p>

        <div className={styles.legalBody}>
          {page.sections.map(([title, text]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </section>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <div>
          <strong>ReadList</strong>
          <p>Book tracking, reading progress, and habits in one organized place.</p>
        </div>
        <div className={styles.footerLinks}>
          <Link to="/">Home</Link>
          <Link to="/terms">Terms of Use</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  )
}
