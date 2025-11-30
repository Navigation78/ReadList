import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function Dashboard() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
    }
    load()
  }, [])

  if (!user) return <p>Please log in to view your dashboard.</p>

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white border-2 border-gray-200 shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-roboto mb-2">Dashboard</h2>
        <p className="text-sm text-gray-700">Welcome, {user.email}</p>
        <p className="mt-3 text-sm text-gray-600">Here you'll find your personalized reading stats and saved books.</p>
      </div>
    </div>
  )
}

export default Dashboard
