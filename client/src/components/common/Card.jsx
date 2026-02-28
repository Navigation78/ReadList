import styles from './Card.module.css'

export default function Card({ 
  children, 
  variant = 'default',
  padding = 'default',
  hoverable = false,
  onClick,
  className = ''
}) {
  const classNames = [
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    hoverable && styles.hoverable,
    onClick && styles.clickable,
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