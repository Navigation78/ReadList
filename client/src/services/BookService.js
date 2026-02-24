import { supabase } from '../lib/supabaseClient'

export const bookService = {
  // Get all books for current user
  async getBooks(userId) {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get books by status
  async getBooksByStatus(userId, status) {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', userId)
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Add a new book
  async addBook(userId, bookData) {
    const { data, error } = await supabase
      .from('books')
      .insert([
        {
          user_id: userId,
          ...bookData
        }
      ])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Update book
  async updateBook(bookId, updates) {
    const { data, error } = await supabase
      .from('books')
      .update(updates)
      .eq('id', bookId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete book
  async deleteBook(bookId) {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId)
    
    if (error) throw error
  },

  // Update reading progress
  async updateProgress(bookId, currentPage) {
    const { data, error } = await supabase
      .from('books')
      .update({ 
        current_page: currentPage,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Mark book as finished
  async markAsFinished(bookId) {
    const { data, error } = await supabase
      .from('books')
      .update({ 
        status: 'finished',
        finished_at: new Date().toISOString()
      })
      .eq('id', bookId)
      .select()
    
    if (error) throw error
    return data[0]
  }
}