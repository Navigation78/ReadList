import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function Navbar() {
  const [user, setUser] = useState(null)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setUser(data.session?.user ?? null)
      } catch (err) {
        setUser(null)
      }
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/')
  }

  return (
    <nav className="w-full bg-white border-b-2 border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <span className="text-3xl">📚</span>
            <span className="text-2xl font-bold text-[#473C33] group-hover:text-[#FEC868] transition-colors">
              ReadList
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/about" 
              className="text-base font-medium text-gray-700 hover:text-[#FEC868] transition-colors"
            >
              About
            </Link>
            <Link 
              to="/books" 
              className="text-base font-medium text-gray-700 hover:text-[#FEC868] transition-colors"
            >
              My Books
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className="text-base font-medium text-gray-700 hover:text-[#FEC868] transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-3 pl-4 border-l-2 border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#ABC270] flex items-center justify-center text-white font-bold text-sm">
                      {user.email?.[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-600 max-w-[150px] truncate">
                      {user.email}
                    </span>
                  </div>
                  <button 
                    onClick={handleSignOut} 
                    className="px-4 py-2 rounded-lg bg-[#FDA769] text-white font-semibold hover:opacity-90 transition-all text-sm"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/signup" 
                  className="px-4 py-2 text-base font-medium text-gray-700 hover:text-[#FEC868] transition-colors"
                >
                  Sign up
                </Link>
                <Link 
                  to="/login" 
                  className="px-6 py-2 rounded-lg bg-[#FEC868] text-[#473C33] font-semibold hover:opacity-90 transition-all text-sm"
                >
                  Log in
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setOpen(!open)} 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-[#473C33]" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} 
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden border-t-2 border-gray-200 bg-white shadow-lg">
          <div className="px-6 py-4 space-y-3">
            <Link 
              to="/about" 
              className="block py-2 text-base font-medium text-gray-700 hover:text-[#FEC868] transition-colors"
              onClick={() => setOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/books" 
              className="block py-2 text-base font-medium text-gray-700 hover:text-[#FEC868] transition-colors"
              onClick={() => setOpen(false)}
            >
              My Books
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block py-2 text-base font-medium text-gray-700 hover:text-[#FEC868] transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="pt-3 border-t-2 border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#ABC270] flex items-center justify-center text-white font-bold">
                      {user.email?.[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-600 truncate">
                      {user.email}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      handleSignOut()
                      setOpen(false)
                    }} 
                    className="w-full px-4 py-3 rounded-lg bg-[#FDA769] text-white font-semibold hover:opacity-90 transition-all"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t-2 border-gray-200 space-y-2">
                <Link 
                  to="/signup" 
                  className="block py-2 text-base font-medium text-gray-700 hover:text-[#FEC868] transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Sign up
                </Link>
                <Link 
                  to="/login" 
                  className="block px-4 py-3 rounded-lg bg-[#FEC868] text-[#473C33] font-semibold text-center hover:opacity-90 transition-all"
                  onClick={() => setOpen(false)}
                >
                  Log in
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar