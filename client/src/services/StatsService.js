import { supabase } from '../lib/supabaseClient'

/**
 * Statistics Service
 * Handles all reading statistics calculations
 */

export const statsService = {
  /**
   * Get overall reading statistics for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Statistics object
   */
  async getReadingStats(userId) {
    try {
      // Get all books
      const { data: books, error: booksError } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', userId)
      
      if (booksError) throw booksError

      // Calculate stats
      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth()

      const stats = {
        totalBooks: books.length,
        booksFinished: books.filter(b => b.status === 'finished').length,
        currentlyReading: books.filter(b => b.status === 'currently_reading').length,
        wantToRead: books.filter(b => b.status === 'want_to_read').length,
        
        // This year stats
        booksFinishedThisYear: books.filter(b => {
          if (!b.finished_at) return false
          return new Date(b.finished_at).getFullYear() === currentYear
        }).length,

        // This month stats
        pagesReadThisMonth: books
          .filter(b => {
            if (!b.finished_at) return false
            const date = new Date(b.finished_at)
            return date.getFullYear() === currentYear && date.getMonth() === currentMonth
          })
          .reduce((sum, b) => sum + (b.page_count || 0), 0),

        // Total pages read
        totalPagesRead: books
          .filter(b => b.status === 'finished')
          .reduce((sum, b) => sum + (b.page_count || 0), 0)
      }

      return stats
    } catch (error) {
      console.error('Error fetching reading stats:', error)
      throw error
    }
  },

  /**
   * Calculate reading streak (consecutive days with reading activity)
   * @param {string} userId - User ID
   * @returns {Promise<number>} Streak count in days
   */
  async getReadingStreak(userId) {
    try {
      // Get all sessions ordered by date
      const { data: sessions, error } = await supabase
        .from('reading_sessions')
        .select('session_date')
        .eq('user_id', userId)
        .order('session_date', { ascending: false })
      
      if (error) throw error
      if (!sessions || sessions.length === 0) return 0

      // Get unique dates
      const uniqueDates = [...new Set(sessions.map(s => 
        new Date(s.session_date).toDateString()
      ))]

      // Calculate streak
      let streak = 0
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      for (let i = 0; i < uniqueDates.length; i++) {
        const sessionDate = new Date(uniqueDates[i])
        sessionDate.setHours(0, 0, 0, 0)

        const expectedDate = new Date(today)
        expectedDate.setDate(expectedDate.getDate() - streak)

        if (sessionDate.getTime() === expectedDate.getTime()) {
          streak++
        } else {
          break
        }
      }

      return streak
    } catch (error) {
      console.error('Error calculating streak:', error)
      return 0
    }
  },

  /**
   * Get monthly reading breakdown
   * @param {string} userId - User ID
   * @param {number} monthsBack - Number of months to look back (default 6)
   * @returns {Promise<Array>} Array of monthly stats
   */
  async getMonthlyBreakdown(userId, monthsBack = 6) {
    try {
      const { data: books, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'finished')
      
      if (error) throw error

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthCounts = {}
      
      books.forEach(book => {
        if (book.finished_at) {
          const date = new Date(book.finished_at)
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`
          monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1
        }
      })

      // Get last N months
      const result = []
      const now = new Date()
      for (let i = monthsBack - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`
        result.push({
          month: months[date.getMonth()],
          year: date.getFullYear(),
          count: monthCounts[monthKey] || 0
        })
      }

      return result
    } catch (error) {
      console.error('Error fetching monthly breakdown:', error)
      throw error
    }
  }
}

export default statsService