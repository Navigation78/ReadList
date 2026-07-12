import { Loader2 } from 'lucide-react'

// shared variants so every button in the app pulls from one place
const variants = {
  primary: 'bg-plum-500 text-white hover:bg-plum-600 focus-visible:ring-plum-500',
  secondary: 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50 focus-visible:ring-plum-500',
  ghost: 'bg-transparent text-stone-600 hover:bg-stone-100 focus-visible:ring-plum-500'
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        h-11 px-5 rounded-lg text-sm font-medium
        inline-flex items-center justify-center gap-2
        transition disabled:opacity-60 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...rest}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}