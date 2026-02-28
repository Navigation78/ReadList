import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import logoImage from '../../assets/VerseLore Logo.png'
import styles from './ForgotPassword.module.css'

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
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <img src={logoImage} alt="VerseLore" className={styles.logo} />
          <h1 className={styles.title}>Forgot Password?</h1>
          <p className={styles.subtitle}>
            Enter your email and we'll send you a link to reset your password
          </p>
        </div>

        {/* Form */}
        {!success ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <div className={styles.errorAlert} role="alert">
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
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        ) : (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.successTitle}>Check Your Email</h2>
            <p className={styles.successText}>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className={styles.successText}>
              Click the link in the email to reset your password.
            </p>
          </div>
        )}

        {/* Back to Login */}
        <div className={styles.footer}>
          <Link to="/login" className={styles.backLink}>
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}