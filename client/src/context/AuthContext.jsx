/*Code segments
*Create the context
*custom hook to use auth context
*Auth provider component
*check if user is logged in on mount and get initial session
*listen for auth changes (login, logout, token refresh)
*cleanup subscription on unmount
*check current user 
*sign up with email and password
**check if email confirmation is required
*login with email and password
*logout
*send password reset email
*update password (after reset)
*update user profile and refresh user data
*value provided to consumers
*/
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

// Create the context
const AuthContext = createContext({})

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// AuthProvider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    // Get initial session
    checkUser()

    // Listen for auth changes (login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    // Cleanup subscription
    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  // Check current user
  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Sign up with email and password
  async function signup(email, password, metadata = {}) {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata // Additional user data (like display_name)
        }
      })

      if (error) throw error

      // Check if email confirmation is required
      if (data.user && !data.session) {
        return {
          success: true,
          message: 'Please check your email to confirm your account.',
          user: data.user
        }
      }

      return { success: true, user: data.user }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Login with email and password
  async function login(email, password) {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return { success: true, user: data.user }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Logout
  async function logout() {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      setUser(null)
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Send password reset email
  async function resetPassword(email) {
    try {
      setLoading(true)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error

      return { success: true, message: 'Password reset email sent!' }
    } catch (error) {
      console.error('Password reset error:', error)
      return { success: false, error: error.message }
    } finally{
      setLoading(false)
    }
  }

  // Update password (after reset)
  async function updatePassword(newPassword) {
    try {
      setLoading(true)

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      return { success: true, message: 'Password updated successfully!' }
    } catch (error) {
      console.error('Update password error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Update user profile
  async function updateProfile(updates) {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates
      })

      if (error) throw error

      // Refresh user data
      await checkUser()

      return { success: true, message: 'Profile updated successfully!' }
    } catch (error) {
      console.error('Update profile error:', error)
      return { success: false, error: error.message }
    }
  }

  // Value provided to consumers
  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updatePassword,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext