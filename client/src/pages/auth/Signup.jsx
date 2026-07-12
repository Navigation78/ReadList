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
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
        {/* logo and heading */}
        <div className="flex flex-col items-center text-center mb-8">
          <img src={logoImage} alt="ReadList" className="w-12 h-12 rounded-lg object-cover mb-4" />
          <h1 className="text-xl font-semibold text-stone-900 mb-2">Create account</h1>
          <p className="text-sm text-stone-500">Start tracking your reading journey</p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {serverError && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3"
            >
              {serverError}
            </div>
          )}

          {successMessage && (
            <div
              role="alert"
              className="bg-sage-50 border border-sage-200 text-sage-700 text-sm rounded-lg px-4 py-3"
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
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>

        {/* login link */}
        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-sm text-stone-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-plum-600 hover:text-plum-700 transition">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}