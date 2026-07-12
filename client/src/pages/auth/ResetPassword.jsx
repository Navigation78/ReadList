import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import logoImage from '../../assets/Black Logo.png'

export default function ResetPassword() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  // check if we have the required token
  useEffect(() => {
    const accessToken = searchParams.get('access_token')
    if (!accessToken) {
      setServerError('Invalid or expired reset link. Please request a new one.')
    }
  }, [searchParams])

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

    if (!validateForm()) return

    setLoading(true)

    const result = await updatePassword(formData.password)

    setLoading(false)

    if (result.success) {
      // show success and redirect to login
      alert('Password updated successfully! Please login with your new password.')
      navigate('/login')
    } else {
      setServerError(result.error || 'Failed to update password. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
        {/* logo and heading */}
        <div className="flex flex-col items-center text-center mb-8">
          <img src={logoImage} alt="ReadList" className="w-12 h-12 rounded-lg object-cover mb-4" />
          <h1 className="text-xl font-semibold text-stone-900 mb-2">Reset password</h1>
          <p className="text-sm text-stone-500">Enter your new password</p>
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
            label="New password"
            type="password"
            name="password"
            placeholder="Enter new password"
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
            placeholder="Confirm new password"
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
            disabled={loading || !!serverError}
          >
            {loading ? 'Updating...' : 'Reset password'}
          </Button>
        </form>
      </div>
    </div>
  )
}