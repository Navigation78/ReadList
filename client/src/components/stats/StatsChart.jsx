import styles from './StatsChart.module.css'

// Simple placeholder - you can enhance this with a charting library later
export default function StatsChart({ data, title }) {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.chart}>
        {data.map((item, index) => (
          <div key={index} className={styles.bar}>
            <div 
              className={styles.barFill}
              style={{ height: `${(item.value / maxValue) * 100}%` }}
            >
              <span className={styles.value}>{item.value}</span>
            </div>
            <span className={styles.label}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}