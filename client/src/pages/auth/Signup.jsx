import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import logoImage from '../../assets/Black Logo.png'

export default function Signup() {
  const { signup, loading } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    setSuccessMessage('')

    if (!validateForm()) return

    const result = await signup(formData.email, formData.password)

    if (result.success) {
      if (result.message) {
        // email confirmation required
        setSuccessMessage(result.message)
      } else {
        // auto-login successful
        navigate('/dashboard')
      }
    } else {
      setServerError(result.error || 'Failed to create account. Please try again.')
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
          <h1 className="font-['Quicksand'] font-bold text-2xl text-[#795465] mb-2">Create account</h1>
          <p className="font-['Be_Vietnam_Pro'] text-sm text-[#4f4448]/70">Start tracking your reading journey</p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {serverError && (
            <div
              role="alert"
              className="bg-[#ffdad6] text-[#93000a] font-['Be_Vietnam_Pro'] text-sm rounded-2xl px-4 py-3"
            >
              {serverError}
            </div>
          )}

          {successMessage && (
            <div
              role="alert"
              className="bg-[#c1dcc6]/40 text-[#4a6150] font-['Be_Vietnam_Pro'] text-sm rounded-2xl px-4 py-3"
            >
              {successMessage}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            fullWidth
            required
            className="rounded-2xl font-['Be_Vietnam_Pro'] focus:ring-4 focus:ring-[#f8c8dc]"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            helperText="Must be at least 6 characters"
            fullWidth
            required
            className="rounded-2xl font-['Be_Vietnam_Pro'] focus:ring-4 focus:ring-[#f8c8dc]"
          />

          <Input
            label="Confirm password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
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
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>

        {/* login link */}
        <div className="mt-8 pt-6 border-t border-[#e3e2e1] text-center">
          <p className="font-['Be_Vietnam_Pro'] text-sm text-[#4f4448]/70">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[#795465] hover:text-[#5f3c4d] transition">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}