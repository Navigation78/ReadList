import { supabase } from '../lib/supabaseClient'

export const statsService = {
  // Get reading stats for user
  async getReadingStats(userId) {
    // Books finished this year
    const { data: finishedBooks, error: booksError } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'finished')
      .gte('finished_at', new Date(new Date().getFullYear(), 0, 1).toISOString())
    
    if (booksError) throw booksError

    // Currently reading
    const { data: currentBooks, error: currentError } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'currently_reading')
    
    if (currentError) throw currentError

    // Reading sessions this month
    const { data: sessions, error: sessionsError } = await supabase
      .from('reading_sessions')
      .select('pages_read, session_date')
      .eq('user_id', userId)
      .gte('session_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
    
    if (sessionsError) throw sessionsError

    return {
      booksFinishedThisYear: finishedBooks.length,
      currentlyReading: currentBooks.length,
      pagesReadThisMonth: sessions.reduce((sum, s) => sum + s.pages_read, 0),
      totalPages: finishedBooks.reduce((sum, b) => sum + (b.page_count || 0), 0)
    }
  },

  // Calculate reading streak
  async getReadingStreak(userId) {
    const { data: sessions, error } = await supabase
      .from('reading_sessions')
      .select('session_date')
      .eq('user_id', userId)
      .order('session_date', { ascending: false })
    
    if (error) throw error

    // Calculate streak logic here
    let streak = 0
    const today = new Date().toISOString().split('T')[0]
    
    // Simple streak calculation (you can enhance this)
    for (let i = 0; i < sessions.length; i++) {
      const sessionDate = sessions[i].session_date
      if (sessionDate === today || sessionDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
        streak++
      } else {
        break
      }
    }

    return streak
  }
}