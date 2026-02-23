import { useState, useEffect } from 'react'
import { bookService } from '../services/bookService'
import { useAuth } from '../context/AuthContext'

export function useBooks(status = null) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    async function fetchBooks() {
      try {
        setLoading(true)
        const data = status 
          ? await bookService.getBooksByStatus(user.id, status)
          : await bookService.getBooks(user.id)
        setBooks(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [user, status])

  const addBook = async (bookData) => {
    const newBook = await bookService.addBook(user.id, bookData)
    setBooks([newBook, ...books])
    return newBook
  }

  const updateBook = async (bookId, updates) => {
    const updatedBook = await bookService.updateBook(bookId, updates)
    setBooks(books.map(b => b.id === bookId ? updatedBook : b))
    return updatedBook
  }

  const deleteBook = async (bookId) => {
    await bookService.deleteBook(bookId)
    setBooks(books.filter(b => b.id !== bookId))
  }

  return { books, loading, error, addBook, updateBook, deleteBook }
}