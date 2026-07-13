import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import logoImage from '../../assets/Black Logo.png'
import { CheckCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!email) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email')
      return
    }

    setLoading(true)

    const result = await resetPassword(email)

    setLoading(false)

    if (result.success) {
      setSuccess(true)
      setEmail('')
    } else {
      setError(result.error || 'Failed to send reset email. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen bg-[#faf9f8] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Whimsical background glow */}
      <div
        className="fixed inset-0 -z-10 opacity-40 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 10% 20%, rgba(248,200,220,0.3) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(225,225,245,0.3) 0%, transparent 20%), radial-gradient(circle at 50% 50%, rgba(193,220,198,0.2) 0%, transparent 40%)',
        }}
      />

      <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_-10px_rgba(248,200,220,0.6)]">
        {/* logo and heading */}
        <div className="flex flex-col items-center text-center mb-8">
          <img src={logoImage} alt="ReadList" className="w-12 h-12 rounded-2xl object-cover mb-4" />
          <h1 className="font-['Quicksand'] font-bold text-2xl text-[#795465] mb-2">Forgot password</h1>
          <p className="font-['Be_Vietnam_Pro'] text-sm text-[#4f4448]/70 leading-relaxed">
            Enter your email and we will send you a link to reset your password.
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div
                role="alert"
                className="bg-[#ffdad6] text-[#93000a] font-['Be_Vietnam_Pro'] text-sm rounded-2xl px-4 py-3"
              >
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error && !email ? error : ''}
              fullWidth
              required
              className="rounded-2xl font-['Be_Vietnam_Pro'] focus:ring-4 focus:ring-[#f8c8dc]"
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
              className="rounded-full bg-[#795465] hover:bg-[#795465]/90 font-['Quicksand'] font-bold shadow-lg"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center text-center gap-3 py-2">
            <div className="w-14 h-14 rounded-full bg-[#c1dcc6]/40 text-[#4a6150] flex items-center justify-center">
              <CheckCircle size={28} />
            </div>
            <h2 className="font-['Quicksand'] font-semibold text-lg text-[#1a1c1c]">Check your email</h2>
            <p className="font-['Be_Vietnam_Pro'] text-sm text-[#4f4448]/70">
              We sent a password reset link to <strong className="text-[#795465]">{email}</strong>
            </p>
            <p className="font-['Be_Vietnam_Pro'] text-sm text-[#4f4448]/70">
              Click the link in the email to reset your password.
            </p>
          </div>
        )}

        {/* back to login */}
        <div className="mt-8 pt-6 border-t border-[#e3e2e1] text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 font-['Be_Vietnam_Pro'] text-sm font-medium text-[#4f4448]/70 hover:text-[#795465] transition"
          >
            <ArrowLeft size={15} /> Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}