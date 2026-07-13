import { Loader2 } from 'lucide-react'

// shared variants so every button in the app pulls from one place

const variants = {
  primary: 'bg-rose-500 text-white hover:bg-rose-600 focus-visible:ring-rose-500',
  secondary: 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700 focus-visible:ring-rose-500',
  outline: 'bg-transparent text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800 focus-visible:ring-rose-500',
  ghost: 'bg-transparent text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 focus-visible:ring-rose-500',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500'
}
const sizes = {
  small: 'h-9 px-4 text-xs',
  medium: 'h-11 px-5 text-sm',
  large: 'h-12 px-6 text-base'
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