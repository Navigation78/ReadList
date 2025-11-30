import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

function SignUp() {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate() 

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setMessage('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      setLoading(false)

      if (signUpError) {
        setError(signUpError.message || 'Sign up failed.')
        return
      }

      setMessage('Signup successful! Check your email to confirm.')
      navigate('/login')
    } catch (err) {
      setLoading(false)
      setError(err?.message || 'Unexpected error during signup.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#ABC270] to-[#FEC868] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl">📚</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#473C33] mb-2">Welcome to ReadList</h1>
            <p className="text-gray-600 text-sm">Create your account to start tracking your reading journey</p>
          </div>

          {/* FORM STARTS */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-pulse">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[#473C33] font-semibold mb-2 text-sm">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FEC868] focus:ring-2 focus:ring-[#FEC868] focus:ring-opacity-20 focus:outline-none transition-all duration-200"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[#473C33] font-semibold mb-2 text-sm">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-[#FEC868] focus:ring-2 focus:ring-[#FEC868] focus:ring-opacity-20 focus:outline-none transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#473C33] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-[#473C33] font-semibold mb-2 text-sm">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-[#FEC868] focus:ring-2 focus:ring-[#FEC868] focus:ring-opacity-20 focus:outline-none transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#473C33] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 bg-gradient-to-r from-[#FEC868] to-[#FDA769] text-[#473C33] hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#473C33]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : 'Sign Up'}
              </button>
            </div>

          </form>
          {/* FORM ENDS */}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  alert('Would navigate to /login')
                }}
                className="text-[#FEC868] font-bold hover:text-[#FDA769] transition-colors hover:underline"
              >
                Log in here
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default SignUp
