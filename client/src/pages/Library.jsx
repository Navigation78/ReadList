import { useState } from 'react'
import { useBooks } from '../hooks/useBooks'
import BookCard from '../components/books/BookCard'
import './Library.css'

export default function Library() {
  const [activeTab, setActiveTab] = useState('currently_reading')
  
  const { books: wantToRead, loading: loadingWant } = useBooks('want_to_read')
  const { books: currentlyReading, loading: loadingCurrent } = useBooks('currently_reading')
  const { books: finished, loading: loadingFinished } = useBooks('finished')

  const tabs = [
    { id: 'want_to_read', label: 'Want to Read', count: wantToRead.length },
    { id: 'currently_reading', label: 'Currently Reading', count: currentlyReading.length },
    { id: 'finished', label: 'Finished', count: finished.length }
  ]

  const getCurrentBooks = () => {
    switch(activeTab) {
      case 'want_to_read':
        return { books: wantToRead, loading: loadingWant }
      case 'currently_reading':
        return { books: currentlyReading, loading: loadingCurrent }
      case 'finished':
        return { books: finished, loading: loadingFinished }
      default:
        return { books: [], loading: false }
    }
  }

  const { books, loading } = getCurrentBooks()

  return (
    <div className="library-container">
      <div className="library-header">
        <h1 className="library-title">My Library</h1>
        <p className="library-subtitle">
          {wantToRead.length + currentlyReading.length + finished.length} books total
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="books-section">
        {loading ? (
          <div className="loading">Loading books...</div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <h3>No books here yet</h3>
            <p>Start adding books to your library!</p>
            <a href="/search" className="btn btn-primary">Search Books</a>
          </div>
        ) : (
          <div className="books-grid">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}