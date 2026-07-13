import { useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

// each type maps to a background, border, text, and icon color
const typeStyles = {
  success: { wrap: 'bg-mint-50 border-mint-200 text-mint-700', icon: 'text-mint-600' },
  error: { wrap: 'bg-red-50 border-red-200 text-red-700', icon: 'text-red-600' },
  warning: { wrap: 'bg-amber-50 border-amber-200 text-amber-700', icon: 'text-amber-600' },
  info: { wrap: 'bg-lavender-50 border-lavender-200 text-lavender-700', icon: 'text-lavender-600' }
}

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
    error: <XCircle size={16} />,
    warning: <AlertTriangle size={16} />,
    info: <Info size={16} />
  }

  const style = typeStyles[type]

  return (
    <div
      role="alert"
      className={`flex items-center gap-3 rounded-full border px-5 py-3 shadow-sm min-w-[280px] max-w-sm ${style.wrap}`}
    >
      <span className={style.icon}>{icons[type]}</span>
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        aria-label="Close notification"
        className="text-current opacity-60 hover:opacity-100 transition"
      >
        <X size={14} />
      </button>
    </div>
  )
}

// toast container component, stacks toasts in the top right corner
export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2">
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