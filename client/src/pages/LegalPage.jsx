import { Link } from 'react-router-dom'
import {
  BookOpen,
  HelpCircle,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserX
} from 'lucide-react'
import logoImage from '../assets/Black Logo.png'

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

// icons and tints cycle by section index so the layout works for either page type
const sectionStyle = [
  { icon: ShieldCheck, tint: 'rose' },
  { icon: UserX, tint: 'lavender' },
  { icon: Sparkles, tint: 'mint' },
  { icon: RefreshCw, tint: 'rose' },
  { icon: HelpCircle, tint: 'lavender' }
]

// Full literal class names per tint so Tailwind's JIT scanner can find them.
// (Building class names via template strings like `bg-${tint}-100` silently
// drops the utility from the build since Tailwind never sees the full string.)
const tintClasses = {
  rose: { border200: 'border-rose-200', bg100: 'bg-rose-100', text600: 'text-rose-600' },
  lavender: { border200: 'border-lavender-200', bg100: 'bg-lavender-100', text600: 'text-lavender-600' },
  mint: { border200: 'border-mint-200', bg100: 'bg-mint-100', text600: 'text-mint-600' }
}

const bubblyBg = {
  backgroundImage:
    'radial-gradient(circle at 10% 10%, rgba(248,200,220,0.15) 0%, transparent 20%), ' +
    'radial-gradient(circle at 90% 80%, rgba(206,233,211,0.15) 0%, transparent 20%), ' +
    'radial-gradient(circle at 50% 50%, rgba(225,225,245,0.15) 0%, transparent 30%)'
}

export default function LegalPage({ type = 'terms' }) {
  const page = content[type] || content.terms
  // first two sections become the highlight cards, the rest sit in the detailed list below
  const [highlightA, highlightB, ...rest] = page.sections

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-body" style={bubblyBg}>
      {/* header */}
      <header className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur-md shadow-[0_8px_30px_rgba(248,200,220,0.35)]">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-rose-500">
            <img src={logoImage} alt="" className="w-8 h-8 rounded-lg object-cover" />
            ReadList
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-stone-500 hover:text-rose-500 transition">Log In</Link>
            <Link
              to="/signup"
              className="bg-rose-200 text-rose-700 px-6 py-2 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-rose-200/60 active:scale-95 transition-all"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 relative">
        {/* decorative floating icons, hidden on small screens */}
        <Sparkles
          className="absolute -left-16 top-24 text-rose-200 opacity-60 hidden lg:block"
          size={90}
          style={{ animation: 'float 6s ease-in-out infinite' }}
        />
        <Sparkles
          className="absolute -right-12 top-80 text-mint-200 opacity-60 hidden lg:block"
          size={60}
          style={{ animation: 'float 6s ease-in-out infinite 2s' }}
        />

        {/* page header */}
        <div className="text-center mb-12 relative z-10">
          <span className="inline-block px-4 py-1 mb-4 rounded-full bg-mint-100 text-mint-600 text-xs font-semibold">
            Legal
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-rose-500 mb-4">{page.title}</h1>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">{page.intro}</p>
        </div>

        {/* two highlight cards from the first two sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-6 relative z-10">
          {[highlightA, highlightB].map(([title, text], i) => {
            const { icon: Icon, tint } = sectionStyle[i]
            return (
              <section
                key={title}
                className={`bg-white p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all flex flex-col gap-4 border-t-4 ${tintClasses[tint].border200}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${tintClasses[tint].bg100} flex items-center justify-center ${tintClasses[tint].text600}`}>
                    <Icon size={18} />
                  </div>
                  <h2 className={`font-display text-lg font-semibold ${tintClasses[tint].text600}`}>{title}</h2>
                </div>
                <p className="text-stone-500 text-sm leading-relaxed">{text}</p>
              </section>
            )
          })}
        </div>

        {/* remaining sections in one detailed card */}
        <section className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_30px_60px_rgba(248,200,220,0.15)] mb-12 relative z-10">
          <div className="space-y-8">
            {rest.map(([title, text], i) => {
              const { icon: Icon, tint } = sectionStyle[i + 2]
              return (
                <div key={title}>
                  <h3 className={`font-display text-lg font-semibold ${tintClasses[tint].text600} mb-2 flex items-center gap-2`}>
                    <Icon size={18} />
                    {title}
                  </h3>
                  <p className="text-stone-500 leading-relaxed">{text}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* contact card */}
        <div className="bg-lavender-100 text-lavender-700 p-10 rounded-3xl text-center shadow-[0_20px_40px_rgba(92,93,110,0.1)] relative z-10">
          <h3 className="font-display text-xl font-semibold mb-2">Have questions?</h3>
          <p className="opacity-80 mb-6">We are happy to help clarify anything on this page.</p>
          <a
            href="mailto:support@readlist.app"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-lavender-600 font-bold rounded-full hover:shadow-lg transition-all active:scale-95"
          >
            <Mail size={18} /> Contact support
          </a>
        </div>
      </main>

      {/* footer */}
      <footer className="bg-white rounded-t-3xl">
        <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-rose-500">
            <BookOpen size={20} /> ReadList
          </div>
          <p className="text-stone-500 text-sm text-center max-w-sm">
            Book tracking, reading progress, and habits in one organized place.
          </p>
          <div className="flex gap-8 flex-wrap justify-center text-sm">
            <Link to="/" className="text-stone-500 hover:text-rose-500 transition">Home</Link>
            <Link
              to="/terms"
              className={type === 'terms' ? 'text-rose-500 font-bold' : 'text-stone-500 hover:text-rose-500 transition'}
            >
              Terms of Use
            </Link>
            <Link
              to="/privacy"
              className={type === 'privacy' ? 'text-rose-500 font-bold' : 'text-stone-500 hover:text-rose-500 transition'}
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}