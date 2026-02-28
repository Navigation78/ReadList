import { useState } from 'react'
import styles from './Tooltip.module.css'

export default function Tooltip({ 
  children,
  content,
  position = 'top'
}) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div 
      className={styles.wrapper}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div 
          className={`${styles.tooltip} ${styles[position]}`}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  )
}