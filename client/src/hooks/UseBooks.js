import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { bookService } from '../services/bookService'

/**
 * Custom hook for managing books
 * @param {string} status - Optional status filter ('want_to_read', 'currently_reading', 'finished')
 * @returns {Object} Books data and operations
 */
export function useBooks(status = null) {
  const { user } = useAuth()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Load books from database
   */
  const loadBooks = async () => {
    if (!user) {
      setBooks([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      let data
      if (status) {
        data = await bookService.getBooksByStatus(user.id, status)
      } else {
        data = await bookService.getBooks(user.id)
      }
      
      setBooks(data)
    } catch (err) {
      console.error('Error loading books:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Add a new book
   */
  const addBook = async (bookData) => {
    try {
      const newBook = await bookService.addBook(user.id, bookData)
      setBooks(prev => [newBook, ...prev])
      return { success: true, book: newBook }
    } catch (err) {
      console.error('Error adding book:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Update a book
   */
  const updateBook = async (bookId, updates) => {
    try {
      const updatedBook = await bookService.updateBook(bookId, updates)
      setBooks(prev => prev.map(b => b.id === bookId ? updatedBook : b))
      return { success: true, book: updatedBook }
    } catch (err) {
      console.error('Error updating book:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Delete a book
   */
  const deleteBook = async (bookId) => {
    try {
      await bookService.deleteBook(bookId)
      setBooks(prev => prev.filter(b => b.id !== bookId))
      return { success: true }
    } catch (err) {
      console.error('Error deleting book:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Refresh books data
   */
  const refresh = () => {
    loadBooks()
  }

  // Load books on mount and when user/status changes
  useEffect(() => {
    loadBooks()
  }, [user, status])

  return {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    refresh
  }
}

export default useBooks