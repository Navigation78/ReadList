import styles from './Button.module.css'

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  ariaLabel,
  className = ''
}) {
  const classNames = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classNames}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          <span className={styles.srOnly}>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  )
}