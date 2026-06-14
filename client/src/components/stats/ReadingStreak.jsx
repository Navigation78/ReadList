import styles from './ReadingStreak.module.css'
import { Flame } from 'lucide-react'

export default function ReadingStreak({ days }) {
  return (
    <div className={styles.container}>
      <span className={styles.icon}><Flame size={28} /></span>
      <div className={styles.content}>
        <span className={styles.days}>{days}</span>
        <span className={styles.label}>Day Streak</span>
      </div>
    </div>
  )
}