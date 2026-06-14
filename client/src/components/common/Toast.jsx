import { useEffect } from 'react'
import styles from './Toast.module.css'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

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
    success: <CheckCircle size={16} />,
    error:   <XCircle size={16} />,
    warning: <AlertTriangle size={16} />,
    info:    <Info size={16} />,
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
        <X size={14} />
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