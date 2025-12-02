// src/components/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav id="navbar" className="bg-white border-b-2 border-gray-200 shadow-sm">
      <div id="navbar-content" className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div id="navbar-logo" className="flex items-center">
          <h1 id="navbar-title" className="text-2xl font-bold text-[#ABC270]">
            📖 ReadList
          </h1>
        </div>

        {/* User Info & Logout */}
        <div id="navbar-user" className="flex items-center gap-4">
          <span id="user-email" className="text-sm text-gray-600">
            {user?.email}
          </span>
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
