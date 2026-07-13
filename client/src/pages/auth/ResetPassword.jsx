import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import logoImage from '../../assets/Black Logo.png'

export default function ResetPassword() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

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
      navigate('/login')
    } else {
      setServerError(result.error || 'Failed to update password. The reset link may have expired — please request a new one.')
    }
  }

  return (
    <div className="relative min-h-screen bg-[#faf9f8] dark:bg-stone-950 flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Whimsical background glow */}
      <div
        className="fixed inset-0 -z-10 opacity-40 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 10% 20%, rgba(248,200,220,0.3) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(225,225,245,0.3) 0%, transparent 20%), radial-gradient(circle at 50% 50%, rgba(193,220,198,0.2) 0%, transparent 40%)',
        }}
      />

      <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-[2.5rem] p-8 shadow-[0_10px_40px_-10px_rgba(248,200,220,0.6)]">
        {/* logo and heading */}
        <div className="flex flex-col items-center text-center mb-8">
          <img src={logoImage} alt="ReadList" className="w-12 h-12 rounded-2xl object-cover mb-4" />
          <h1 className="font-['Quicksand'] font-bold text-2xl text-[#795465] mb-2">Reset password</h1>
          <p className="font-['Be_Vietnam_Pro'] text-sm text-[#4f4448] dark:text-stone-300">Enter your new password below</p>
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
            className="rounded-2xl font-['Be_Vietnam_Pro'] focus:ring-4 focus:ring-[#f8c8dc]"
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
            className="rounded-2xl font-['Be_Vietnam_Pro'] focus:ring-4 focus:ring-[#f8c8dc]"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
            className="rounded-lg bg-[#795465] hover:bg-[#795465]/90 font-['Quicksand'] font-bold shadow-lg"
          >
            {loading ? 'Updating...' : 'Reset password'}
          </Button>
        </form>
      </div>
    </div>
  )
}
