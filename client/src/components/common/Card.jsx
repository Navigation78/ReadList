// maps prop values to Tailwind classes, keeps every card consistent across the app
const variants = {
  default: 'bg-white border border-stone-200',
  elevated: 'bg-white border border-stone-100 shadow-sm',
  plum: 'bg-plum-50 border border-plum-100',
  sage: 'bg-sage-50 border border-sage-100'
}

const paddings = {
  none: 'p-0',
  sm: 'p-4',
  default: 'p-6',
  lg: 'p-8'
}

export default function Card({
  children,
  variant = 'default',
  padding = 'default',
  hoverable = false,
  onClick,
  className = ''
}) {
  const classNames = [
    'rounded-2xl transition',
    variants[variant],
    paddings[padding],
    hoverable ? 'hover:border-stone-300 hover:shadow-sm' : '',
    onClick ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum-500 focus-visible:ring-offset-2' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div
      className={classNames}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}