import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { sessionService } from '../services/sessionService'

/**
 * Custom hook for managing reading sessions
 * @param {string} bookId - Optional book ID to filter sessions
 * @returns {Object} Sessions data and operations
 */
export function useReadingSessions(bookId = null) {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Load sessions from database
   */
  const loadSessions = async () => {
    if (!user) {
      setSessions([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      let data
      if (bookId) {
        data = await sessionService.getSessions(bookId)
      } else {
        data = await sessionService.getUserSessions(user.id)
      }
      
      setSessions(data)
    } catch (err) {
      console.error('Error loading sessions:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Log a new session
   */
  const logSession = async (sessionData) => {
    try {
      const newSession = await sessionService.logSession({
        ...sessionData,
        user_id: user.id
      })
      setSessions(prev => [newSession, ...prev])
      return { success: true, session: newSession }
    } catch (err) {
      console.error('Error logging session:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Delete a session
   */
  const deleteSession = async (sessionId) => {
    try {
      await sessionService.deleteSession(sessionId)
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      return { success: true }
    } catch (err) {
      console.error('Error deleting session:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Refresh sessions data
   */
  const refresh = () => {
    loadSessions()
  }

  // Load sessions on mount and when user/bookId changes
  useEffect(() => {
    loadSessions()
  }, [user, bookId])

  return {
    sessions,
    loading,
    error,
    logSession,
    deleteSession,
    refresh
  }
}

export default useReadingSessions