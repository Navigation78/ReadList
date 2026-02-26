import { supabase } from '../lib/supabaseClient'

/**
 * Book Service - Handles all book-related database operations
 * 
 * Functions:
 * - getBooks: Fetch all books for a user
 * - getBooksByStatus: Fetch books filtered by status
 * - getBookById: Fetch a single book by ID
 * - addBook: Add a new book to library
 * - updateBook: Update book details
 * - updateProgress: Update current page
 * - updateStatus: Change book status (want_to_read, currently_reading, finished)
 * - markAsFinished: Mark book as finished
 * - deleteBook: Remove book from library
 */

export const bookService = {
  /**
   * Get all books for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of books
   */
  async getBooks(userId) {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching books:', error)
      throw error
    }
  },

  /**
   * Get books filtered by status
   * @param {string} userId - User ID
   * @param {string} status - Book status ('want_to_read', 'currently_reading', 'finished')
   * @returns {Promise<Array>} Array of books with specified status
   */
  async getBooksByStatus(userId, status) {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', userId)
        .eq('status', status)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error(`Error fetching ${status} books:`, error)
      throw error
    }
  },

  /**
   * Get a single book by ID
   * @param {string} bookId - Book ID
   * @returns {Promise<Object>} Book object
   */
  async getBookById(bookId) {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching book:', error)
      throw error
    }
  },

  /**
   * Add a new book to library
   * @param {string} userId - User ID
   * @param {Object} bookData - Book data
   * @returns {Promise<Object>} Newly created book
   */
  async addBook(userId, bookData) {
    try {
      // Prepare book data with defaults
      const newBook = {
        user_id: userId,
        google_books_id: bookData.google_books_id || null,
        title: bookData.title,
        author: bookData.author,
        description: bookData.description || null,
        cover_url: bookData.cover_url || null,
        page_count: bookData.page_count || null,
        isbn: bookData.isbn || null,
        published_year: bookData.published_year || null,
        genre: bookData.genre || null,
        status: bookData.status || 'want_to_read',
        current_page: bookData.current_page || 0,
        format: bookData.format || null,
        started_at: bookData.status === 'currently_reading' ? new Date().toISOString() : null,
        finished_at: bookData.status === 'finished' ? new Date().toISOString() : null
      }

      const { data, error } = await supabase
        .from('books')
        .insert([newBook])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding book:', error)
      throw error
    }
  },

  /**
   * Update book details
   * @param {string} bookId - Book ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated book
   */
  async updateBook(bookId, updates) {
    try {
      const { data, error } = await supabase
        .from('books')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating book:', error)
      throw error
    }
  },

  /**
   * Update current reading progress
   * @param {string} bookId - Book ID
   * @param {number} currentPage - New current page number
   * @returns {Promise<Object>} Updated book
   */
  async updateProgress(bookId, currentPage) {
    try {
      const { data, error } = await supabase
        .from('books')
        .update({
          current_page: currentPage,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating progress:', error)
      throw error
    }
  },

  /**
   * Update book status
   * @param {string} bookId - Book ID
   * @param {string} newStatus - New status ('want_to_read', 'currently_reading', 'finished')
   * @returns {Promise<Object>} Updated book
   */
  async updateStatus(bookId, newStatus) {
    try {
      const updates = {
        status: newStatus,
        updated_at: new Date().toISOString()
      }

      // Set timestamps based on status
      if (newStatus === 'currently_reading') {
        updates.started_at = new Date().toISOString()
      } else if (newStatus === 'finished') {
        updates.finished_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', bookId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating status:', error)
      throw error
    }
  },

  /**
   * Mark book as finished
   * @param {string} bookId - Book ID
   * @returns {Promise<Object>} Updated book
   */
  async markAsFinished(bookId) {
    try {
      // First, get the book to set current_page to page_count
      const book = await this.getBookById(bookId)

      const { data, error } = await supabase
        .from('books')
        .update({
          status: 'finished',
          current_page: book.page_count || book.current_page,
          finished_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', bookId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error marking book as finished:', error)
      throw error
    }
  },

  /**
   * Delete a book from library
   * @param {string} bookId - Book ID
   * @returns {Promise<void>}
   */
  async deleteBook(bookId) {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId)
      
      if (error) throw error
    } catch (error) {
      console.error('Error deleting book:', error)
      throw error
    }
  },

  /**
   * Search books in user's library
   * @param {string} userId - User ID
   * @param {string} searchQuery - Search term
   * @returns {Promise<Array>} Array of matching books
   */
  async searchBooks(userId, searchQuery) {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', userId)
        .or(`title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error searching books:', error)
      throw error
    }
  },

  /**
   * Get currently reading books
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of currently reading books
   */
  async getCurrentlyReading(userId) {
    return this.getBooksByStatus(userId, 'currently_reading')
  },

  /**
   * Get finished books
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of finished books
   */
  async getFinishedBooks(userId) {
    return this.getBooksByStatus(userId, 'finished')
  },

  /**
   * Get want to read books
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of want to read books
   */
  async getWantToRead(userId) {
    return this.getBooksByStatus(userId, 'want_to_read')
  }
}

export default bookService