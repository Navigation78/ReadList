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
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
        {/* logo and heading */}
        <div className="flex flex-col items-center text-center mb-8">
          <img src={logoImage} alt="ReadList" className="w-12 h-12 rounded-lg object-cover mb-4" />
          <h1 className="text-xl font-semibold text-stone-900 mb-2">Forgot password</h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            Enter your email and we will send you a link to reset your password.
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3"
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
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center text-center gap-3 py-2">
            <div className="w-14 h-14 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center">
              <CheckCircle size={28} />
            </div>
            <h2 className="text-lg font-semibold text-stone-900">Check your email</h2>
            <p className="text-sm text-stone-500">
              We sent a password reset link to <strong className="text-stone-700">{email}</strong>
            </p>
            <p className="text-sm text-stone-500">
              Click the link in the email to reset your password.
            </p>
          </div>
        )}

        {/* back to login */}
        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-plum-600 transition"
          >
            <ArrowLeft size={15} /> Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}