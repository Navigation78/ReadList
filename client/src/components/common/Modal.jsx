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
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`w-full bg-white rounded-2xl border border-stone-200 shadow-lg ${sizes[size]}`}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            {title && (
              <h2 id="modal-title" className="text-base font-semibold text-stone-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  )
}