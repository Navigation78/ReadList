import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedLayout from './components/auth/ProtectedLayout'

// Auth pages
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

// Main pages
import Landing from './pages/Landing'
import Home from './pages/Home'
import Library from './pages/Library'
import SearchBooks from './pages/SearchBooks'
import Stats from './pages/Stats'
import Profile from './pages/Profile'
import LegalPage from './pages/LegalPage'
import BookDetail from './pages/BookDetail'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/terms" element={<LegalPage type="terms" />} />
            <Route path="/privacy" element={<LegalPage type="privacy" />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedLayout>
                  <Home />
                </ProtectedLayout>
              }
            />
            <Route
              path="/library"
              element={
                <ProtectedLayout>
                  <Library />
                </ProtectedLayout>
              }
            />
            <Route
              path="/book/:id"
              element={
                <ProtectedLayout>
                  <BookDetail />
                </ProtectedLayout>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedLayout>
                  <SearchBooks />
                </ProtectedLayout>
              }
            />
            <Route
              path="/stats"
              element={
                <ProtectedLayout>
                  <Stats />
                </ProtectedLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedLayout>
                  <Profile />
                </ProtectedLayout>
              }
            />

            {/* Catch‑all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
