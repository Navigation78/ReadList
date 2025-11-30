import React from 'react'

function Landing() {
  return (
    <div className="max-w-4xl mx-auto text-center py-12 px-4">
      <h1 className="text-4xl font-roboto text-dark">Welcome to ReadList</h1>
      <p className="mt-4 text-gray-600">Your lightweight reading tracker and book discovery app.</p>
      <img src="/logo192.png" alt="ReadList" className="w-40 mx-auto mt-6 rounded" />
      <div className="mt-8">
        <a href="/features" className="inline-block px-6 py-2 rounded bg-primary text-white font-medium">Explore Features</a>
      </div>
    </div>
  )
}

export default Landing
