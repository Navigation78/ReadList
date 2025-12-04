// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';


function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
  const result = await signup(email, password);

  if (result.success) {
    // Check if email confirmation is required
    if (result.emailSent) {
      navigate('/check-email'); // redirect user to check their email
    }
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
    <div id="signup-page" className="fixed inset-0 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/src/assets/Green.jpg')" }}>
      <div id="signup-container" className="w-full max-w-md">
        <div id="signup-card" className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div id="signup-header" className="text-center mb-8">
            <h1 id="signup-title" className="text-3xl font-bold text-[#473C33] mb-2">
               Welcome To ReadList
            </h1>
            <p id="signup-subtitle" className="text-gray-600">
              Create your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div id="error-alert" className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Signup Form */}
          <form id="signup-form" onSubmit={handleSubmit} className="space-y-4">
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
<div id="password-group" className="flex flex-col relative">
  
  <label
    id="password-label"
    htmlFor="password"
    className="text-sm font-semibold text-[#473C33] mb-2"
  >
    Password
  </label>

  <div className="relative">
    
    <input
      id="password-input"
      type={showPassword ? 'text' : 'password'}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="••••••••"
      className="w-full px-4 py-3 border-2 
       border-gray-200 rounded-lg 
       focus:border-[#FEC868] 
       focus:outline-none 
       transition-colors 
       pr-12"
       disabled={isLoading}
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 
                 -translate-y-1/2 
                 text-gray-500 
                 hover:text-gray-800"
    >
      {showPassword ? (
        <EyeOff size={20} />
      ) : (
        <Eye size={20} />
      )}
    </button>

  </div>

  <p id="password-hint" className="text-xs text-gray-500 mt-1">
    At least 6 characters
  </p>

</div>


    <div id="confirm-password-group" className="flex flex-col relative">
              <label id="confirm-password-label" htmlFor="confirmPassword" className="text-sm font-semibold text-[#473C33] mb-2">
               Confirm Password
              </label>

      <div className="relative">
        <input
      id="confirm-password-input"
      type={showPassword ? 'text' : 'password'}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
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


            {/* Submit Button */}
            <button
              id="signup-btn"
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[#537B2F] text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div id="login-link-group" className="text-center mt-6 text-gray-600">
            <p>
              Already have an account?{' '}
              <Link
                id="login-link"
                to="/login"
                className="text-[#532B2F] font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
