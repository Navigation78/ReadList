import { useEffect } from 'react'
import styles from './Toast.module.css'

export default function Toast({ 
  message,
  type = 'info',
  isVisible,
  onClose,
  duration = 3000
}) {
  useEffect(() => {
    if (isVisible && duration) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  return (
    <div className={`${styles.toast} ${styles[type]}`} role="alert">
      <span className={styles.icon}>{icons[type]}</span>
      <span className={styles.message}>{message}</span>
      <button 
        onClick={onClose}
        className={styles.closeButton}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  )
}

// Toast Container Component
export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          isVisible={true}
          onClose={() => onRemove(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  )
}