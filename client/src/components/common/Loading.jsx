import styles from './Loading.module.css'

export default function Loading({ 
  size = 'medium',
  text = 'Loading...',
  fullScreen = false
}) {
  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        <div className={styles.content}>
          <div className={`${styles.spinner} ${styles[size]}`} />
          {text && <p className={styles.text}>{text}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`} />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  )
}