import { useEffect } from 'react'
import { X } from 'lucide-react'

// maps size prop to a max width so callers can request small/medium/large dialogs
const sizes = {
  small: 'max-w-sm',
  medium: 'max-w-lg',
  large: 'max-w-2xl'
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true
}) {
  // handle esc key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/30 backdrop-blur-sm px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`w-full bg-white dark:bg-stone-900 rounded-[2rem] shadow-[0_20px_50px_rgba(248,200,220,0.4)] dark:shadow-none ${sizes[size]}`}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-7 py-5 border-b border-stone-100 dark:border-stone-700">
            {title && (
              <h2 id="modal-title" className="font-display text-lg font-semibold text-rose-500">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-rose-50 dark:hover:bg-stone-800 hover:text-rose-500 transition"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        <div className="px-7 py-6">
          {children}
        </div>
      </div>
    </div>
  )
}