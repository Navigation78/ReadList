import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/login");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white border-b-2 border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <h1 className="text-2xl font-bold text-[#018786]">
          ReadList
        </h1>

        {/* Right side */}
        <div className="flex items-center gap-4">
          
          {/* Profile */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#018786] text-white flex items-center justify-center font-semibold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-600">
              {user?.email}
            </span>
          </div>

          {/* Add Books */}
          <button
            onClick={() => navigate("/search")}
            className="px-4 py-2 bg-[#532B2F] text-white font-semibold rounded-lg hover:opacity-90 transition"
          >
            ➕ Add Books
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
