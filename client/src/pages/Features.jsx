import React from 'react'


function Features() {
  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white border-2 border-gray-200 shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-roboto mb-2">Features</h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Search books via Google Books API</li>
          <li>Save books to your personal list</li>
          <li>Track reading status</li>
          <li>Sign up and save your list in the cloud (Supabase)</li>
        </ul>
      </div>
    </div>
  )
}

export default Features
