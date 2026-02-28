import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import logoImage from '../../assets/VerseLore Logo.png'
import styles from './ResetPassword.module.css'

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

  // Check if we have the required token
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
    // Clear error for this field
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
      // Show success and redirect to login
      alert('Password updated successfully! Please login with your new password.')
      navigate('/login')
    } else {
      setServerError(result.error || 'Failed to update password. Please try again.')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <img src={logoImage} alt="VerseLore" className={styles.logo} />
          <h1 className={styles.title}>Reset Password</h1>
          <p className={styles.subtitle}>Enter your new password</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {serverError && (
            <div className={styles.errorAlert} role="alert">
              {serverError}
            </div>
          )}

          <Input
            label="New Password"
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
            label="Confirm Password"
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
            {loading ? 'Updating...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  )
}