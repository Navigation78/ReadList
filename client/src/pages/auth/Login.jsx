import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import logoImage from '../../assets/Black Logo.png'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({}) // validation errors from the client side
  const [serverError, setServerError] = useState('') // error from the backend

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
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    if (!validateForm()) return

    const result = await login(formData.email, formData.password)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setServerError(result.error || 'Failed to login. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
        {/* logo and heading */}
        <div className="flex flex-col items-center text-center mb-8">
          <img src={logoImage} alt="ReadList" className="w-12 h-12 rounded-lg object-cover mb-4" />
          <h1 className="text-xl font-semibold text-stone-900 mb-2">Welcome back</h1>
          <p className="text-sm text-stone-500">Login to continue your reading journey</p>
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
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            fullWidth
            required
          />

          <Link
            to="/forgot-password"
            className="text-sm font-medium text-plum-600 hover:text-plum-700 -mt-2 self-end transition"
          >
            Forgot password?
          </Link>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {/* sign up link */}
        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-sm text-stone-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-plum-600 hover:text-plum-700 transition">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}