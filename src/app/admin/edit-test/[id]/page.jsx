'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EditTest({ params }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTest()
  }, [])

  const fetchTest = async () => {
    try {
      const response = await fetch(`/api/tests/${params.id}`)
      const data = await response.json()
      if (data.success) {
        setTitle(data.test.title)
        setQuestions(data.test.questions)
      } else {
        console.error('Failed to fetch test')
      }
    } catch (error) {
      console.error('Error fetching test:', error)
    } finally {
      setLoading(false)
    }
  }

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', ''], correctAnswer: 0 }])
  }

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index][field] = value
    setQuestions(updatedQuestions)
  }

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setQuestions(updatedQuestions)
  }

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index)
    setQuestions(updatedQuestions)
  }

  const submitTest = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/tests/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, questions }),
      })
      const data = await response.json()
      if (data.success) {
        router.push('/admin/dashboard')
      } else {
        console.error('Failed to update test')
      }
    } catch (error) {
      console.error('Error updating test:', error)
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Test</h1>
      <form onSubmit={submitTest}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Test Title"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="mb-6 p-4 border rounded">
            <input
              type="text"
              value={question.question}
              onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
              placeholder="Question"
              className="w-full p-2 mb-2 border rounded"
              required
            />
            {question.options.map((option, oIndex) => (
              <div key={oIndex} className="flex mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                  placeholder={`Option ${oIndex + 1}`}
                  className="flex-grow p-2 mr-2 border rounded"
                  required
                />
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={question.correctAnswer === oIndex}
                  onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => removeQuestion(qIndex)}
              className="bg-red-500 text-white px-3 py-1 rounded mt-2"
            >
              Remove Question
            </button>
          </div>
        ))}
        <button type="button" onClick={addQuestion} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
          Add Question
        </button>
        <button type="submit" className="bg-blue-500 mx-4 text-white px-4 py-2 rounded">
          Update Test
        </button>
      </form>
    </div>
  )
}

