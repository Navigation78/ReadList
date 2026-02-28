import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from './Button'
import logoImage from '../../assets/VerseLore Logo.png'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      navigate('/login')
    }
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img 
            src={logoImage} 
            alt="VerseLore Logo" 
            className={styles.logoImage}
          />
          <span className={styles.logoText}>VerseLore</span>
        </Link>

        {/* Navigation Links */}
        {user && (
          <div className={styles.links}>
            <Link 
              to="/" 
              className={`${styles.link} ${isActive('/') ? styles.active : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/library" 
              className={`${styles.link} ${isActive('/library') ? styles.active : ''}`}
            >
              Library
            </Link>
            <Link 
              to="/search" 
              className={`${styles.link} ${isActive('/search') ? styles.active : ''}`}
            >
              Search
            </Link>
            <Link 
              to="/stats" 
              className={`${styles.link} ${isActive('/stats') ? styles.active : ''}`}
            >
              Stats
            </Link>
            <Link 
              to="/profile" 
              className={`${styles.link} ${isActive('/profile') ? styles.active : ''}`}
            >
              Profile
            </Link>
          </div>
        )}

        {/* Auth Buttons */}
        <div className={styles.actions}>
          {user ? (
            <>
              <span className={styles.userEmail}>{user.email}</span>
              <Button variant="outline" size="small" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="small" 
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                variant="primary" 
                size="small" 
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}