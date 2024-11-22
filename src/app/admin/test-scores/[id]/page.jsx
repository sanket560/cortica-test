'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function TestScores({ params }) {
  const [scores, setScores] = useState([])
  const [testTitle, setTestTitle] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScores()
  }, [])

  const fetchScores = async () => {
    try {
      const response = await fetch(`/api/test-scores/${params.id}`)
      const data = await response.json()
      if (data.success) {
        setScores(data.scores)
        setTestTitle(data.testTitle)
      } else {
        console.error('Failed to fetch scores')
      }
    } catch (error) {
      console.error('Error fetching scores:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Test Scores: {testTitle}</h1>
      <Link href="/admin/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Back to Dashboard
      </Link>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Time</th>
              <th className="border border-gray-300 px-4 py-2">Marks</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score) => (
              <tr key={score._id}>
                <td className="border border-gray-300 px-4 py-2">{score.user.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(score.submittedAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(score.submittedAt).toLocaleTimeString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">{score.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

