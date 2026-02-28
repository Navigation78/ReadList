// src/components/auth/AuthLayout.jsx

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded">
        {children}
      </div>
    </div>
  )
}