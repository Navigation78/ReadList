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
          <h1 className="font-['Quicksand'] font-bold text-2xl text-[#795465] mb-2">Welcome back</h1>
          <p className="font-['Be_Vietnam_Pro'] text-sm text-[#4f4448]/70">Login to continue your reading journey</p>
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
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            fullWidth
            required
            className="rounded-2xl font-['Be_Vietnam_Pro'] focus:ring-4 focus:ring-[#f8c8dc]"
          />

          <Link
            to="/forgot-password"
            className="font-['Be_Vietnam_Pro'] text-sm font-medium text-[#795465] hover:text-[#5f3c4d] -mt-2 self-end transition"
          >
            Forgot password?
          </Link>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
            className="rounded-full bg-[#795465] hover:bg-[#795465]/90 font-['Quicksand'] font-bold shadow-lg"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {/* sign up link */}
        <div className="mt-8 pt-6 border-t border-[#e3e2e1] text-center">
          <p className="font-['Be_Vietnam_Pro'] text-sm text-[#4f4448]/70">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-[#795465] hover:text-[#5f3c4d] transition">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}