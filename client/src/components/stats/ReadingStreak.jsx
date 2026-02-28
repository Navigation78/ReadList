import styles from './ReadingStreak.module.css'

export default function ReadingStreak({ days }) {
  return (
    <div className={styles.container}>
      <span className={styles.icon}>🔥</span>
      <div className={styles.content}>
        <span className={styles.days}>{days}</span>
        <span className={styles.label}>Day Streak</span>
      </div>
    </div>
  )
}