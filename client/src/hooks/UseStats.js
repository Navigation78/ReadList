import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { statsService } from '../services/statsService'

/**
 * Custom hook for fetching reading statistics
 * @returns {Object} Statistics data and operations
 */
export function useStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [streak, setStreak] = useState(0)
  const [monthlyData, setMonthlyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Load all statistics
   */
  const loadStats = async () => {
    if (!user) {
      setStats(null)
      setStreak(0)
      setMonthlyData([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Load all stats in parallel
      const [statsData, streakData, monthlyBreakdown] = await Promise.all([
        statsService.getReadingStats(user.id),
        statsService.getReadingStreak(user.id),
        statsService.getMonthlyBreakdown(user.id)
      ])
      
      setStats(statsData)
      setStreak(streakData)
      setMonthlyData(monthlyBreakdown)
    } catch (err) {
      console.error('Error loading stats:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Refresh statistics
   */
  const refresh = () => {
    loadStats()
  }

  // Load stats on mount and when user changes
  useEffect(() => {
    loadStats()
  }, [user])

  return {
    stats,
    streak,
    monthlyData,
    loading,
    error,
    refresh
  }
}

export default useStats