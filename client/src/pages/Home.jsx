import { useAuth } from '../context/AuthContext'
import { useBooks } from '../hooks/useBooks'
import { statsService } from '../services/statsService'
import { useState, useEffect } from 'react'

export default function Home() {
  const { user } = useAuth()
  const { books: currentlyReading } = useBooks('currently_reading')
  const [stats, setStats] = useState(null)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    if (!user) return

    async function fetchData() {
      const statsData = await statsService.getReadingStats(user.id)
      const streakData = await statsService.getReadingStreak(user.id)
      setStats(statsData)
      setStreak(streakData)
    }

    fetchData()
  }, [user])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user?.email}!</h1>
      
      {/* Reading Streak */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">🔥 {streak} Day Streak</h2>
        <p className="text-gray-600">Keep it going!</p>
      </div>

      {/* Currently Reading */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Currently Reading</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentlyReading.map(book => (
            <div key={book.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(book.current_page / book.page_count) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {book.current_page} / {book.page_count} pages
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Books This Year</p>
            <p className="text-2xl font-bold">{stats.booksFinishedThisYear}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Currently Reading</p>
            <p className="text-2xl font-bold">{stats.currentlyReading}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Pages This Month</p>
            <p className="text-2xl font-bold">{stats.pagesReadThisMonth}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Pages</p>
            <p className="text-2xl font-bold">{stats.totalPages}</p>
          </div>
        </div>
      )}
    </div>
  )
}
