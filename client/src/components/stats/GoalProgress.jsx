import styles from './GoalProgress.module.css'

export default function GoalProgress({ current, goal }) {
  const percentage = goal > 0 ? Math.round((current / goal) * 100) : 0

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Annual Reading Goal</h3>
        <span className={styles.numbers}>{current} / {goal}</span>
      </div>
      
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      <p className={styles.text}>
        {percentage >= 100 
          ? '🎉 Goal achieved!' 
          : `${goal - current} books to go`}
      </p>
    </div>
  )
}