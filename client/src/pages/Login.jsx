// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react'; // <-- added import for eye icons
import Snow from "../components/Snow";
import AuthLayout from "../components/AuthLayout";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // <-- state for show/hide password
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
     <AuthLayout>
      {/* login form */}
    </AuthLayout>
   <div className="fixed inset-0 bg-white flex items-center justify-center">
     <div className="relative min-h-screen bg-white overflow-hidden">
      <Snow />

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        {/* Your login form here */}
      </div>
    </div>

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

            {/* Password Input with show/hide functionality */}
            <div id="password-group" className="flex flex-col relative">
              <label id="password-label" htmlFor="password" className="text-sm font-semibold text-[#473C33] mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FEC868] focus:outline-none transition-colors pr-12"
                  disabled={isLoading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

{/* Forgot Password Link */}
<div className="text-right mt-2">
  <Link
    to="/forgot-password"
    className="text-sm text-[#532B2F] font-semibold hover:underline"
  >
    Forgot password?
  </Link>
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
