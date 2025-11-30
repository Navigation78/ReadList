import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

// Inline SVG icons to avoid external peer-dependency issues
const EyeIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.86 21.86 0 0 1 5.06-5.94" />
    <path d="M1 1l22 22" />
    <path d="M9.88 9.88A3 3 0 0 0 14.12 14.12" />
  </svg>
)

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (error) {
        setError(error.message || 'Login failed')
        return
      }
      // Successful login
      navigate('/dashboard')
    } catch (err) {
      setLoading(false)
      setError(err.message || 'Unexpected error')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-gray-200 shadow-lg rounded-lg p-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#473C33] mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-sm">Log in to continue to your account</p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-[#473C33] font-semibold mb-2 text-sm">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FEC868] focus:outline-none transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-[#473C33] font-semibold mb-2 text-sm">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-[#FEC868] focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#473C33] transition-colors text-xs"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
               type="button"
               disabled={loading}
               onClick={handleSubmit}
               className="w-full inline-flex items-center justify-center rounded-lg font-semibold transition-all px-6 py-3 bg-[#FEC868] text-[#473C33] hover:opacity-90 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
              {loading ? 'Signing in...' : 'Log In'}
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <a
                href="/signup"
                className="text-[#FEC868] font-semibold hover:text-[#473C33] transition-colors"
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login