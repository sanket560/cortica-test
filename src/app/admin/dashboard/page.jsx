'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [tests, setTests] = useState([])

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    const response = await fetch('/api/tests')
    const data = await response.json()
    if (data.success) {
      setTests(data.tests)
    }
  }

  const deleteTest = async (id) => {
    const response = await fetch(`/api/tests/${id}`, { method: 'DELETE' })
    const data = await response.json()
    if (data.success) {
      fetchTests()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <Link href="/admin/create-test" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Create New Test
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((test) => (
          <div key={test._id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">{test.title}</h2>
            <p>Questions: {test.questions.length}</p>
            <div className="mt-4">
              <Link href={`/admin/test-scores/${test._id}`} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">
                View Scores
              </Link>
              <Link href={`/admin/edit-test/${test._id}`} className="bg-green-500 text-white px-3 py-1 rounded mr-2">
                Edit
              </Link>
              <button onClick={() => deleteTest(test._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}