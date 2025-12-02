// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="login-page" className="fixed inset-0 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/src/assets/Green.jpg')" }}>
      <div id="login-container" className="w-full max-w-md">
        <div id="login-card" className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div id="login-header" className="text-center mb-8">
            <h1 id="login-title" className="text-3xl font-bold text-[#473C33] mb-2">
               ReadList
            </h1>
            <p id="login-subtitle" className="text-gray-600">
              Sign in to your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div id="error-alert" className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div id="email-group" className="flex flex-col">
              <label id="email-label" htmlFor="email" className="text-sm font-semibold text-[#473C33] mb-2">
                Email
              </label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FEC868] focus:outline-none transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div id="password-group" className="flex flex-col">
              <label id="password-label" htmlFor="password" className="text-sm font-semibold text-[#473C33] mb-2">
                Password
              </label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FEC868] focus:outline-none transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              id="login-btn"
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[#537B2F] text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Signup Link */}
          <div id="signup-link-group" className="text-center mt-6 text-gray-600">
            <p>
              Don't have an account?{' '}
              <Link
                id="signup-link"
                to="/signup"
                className="text-[#532B2F] font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
