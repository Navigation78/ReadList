import { supabase } from '../lib/supabaseClient'
import { bookService } from './bookService'

/**
 * Reading Session Service
 * Handles all reading session operations (logging reading time, notes, etc.)
 */

export const sessionService = {
  /**
   * Log a new reading session
   * @param {Object} sessionData - Session details
   * @returns {Promise<Object>} Created session
   */
  async logSession(sessionData) {
    try {
      const { data, error } = await supabase
        .from('reading_sessions')
        .insert([{
          book_id: sessionData.book_id,
          user_id: sessionData.user_id,
          pages_read: sessionData.pages_read,
          duration_minutes: sessionData.duration_minutes || null,
          notes: sessionData.notes || null,
          session_date: sessionData.session_date || new Date().toISOString(),
          session_time: new Date().toTimeString().split(' ')[0]
        }])
        .select()
        .single()
      
      if (error) throw error

      // Also update book's current page if requested
      if (sessionData.updateBookProgress && sessionData.currentPage !== undefined) {
        const newPage = sessionData.currentPage + sessionData.pages_read
        await bookService.updateProgress(sessionData.book_id, newPage)
      }

      return data
    } catch (error) {
      console.error('Error logging session:', error)
      throw error
    }
  },

  /**
   * Get all sessions for a book
   * @param {string} bookId - Book ID
   * @returns {Promise<Array>} Array of sessions
   */
  async getSessions(bookId) {
    try {
      const { data, error } = await supabase
        .from('reading_sessions')
        .select('*')
        .eq('book_id', bookId)
        .order('session_date', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching sessions:', error)
      throw error
    }
  },

  /**
   * Get all sessions for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of sessions
   */
  async getUserSessions(userId) {
    try {
      const { data, error } = await supabase
        .from('reading_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('session_date', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user sessions:', error)
      throw error
    }
  },

  /**
   * Delete a session
   * @param {string} sessionId - Session ID
   * @returns {Promise<void>}
   */
  async deleteSession(sessionId) {
    try {
      const { error } = await supabase
        .from('reading_sessions')
        .delete()
        .eq('id', sessionId)
      
      if (error) throw error
    } catch (error) {
      console.error('Error deleting session:', error)
      throw error
    }
  }
}

export default sessionService