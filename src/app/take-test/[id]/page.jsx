'use client'

import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { GlobalContext } from '@/Context/GlobalContext'

export default function TakeTest({ params }) {
  const router = useRouter()
  const [test, setTest] = useState(null)
  const [answers, setAnswers] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(null)
  const { userInfo } = useContext(GlobalContext);

  useEffect(() => {
    fetchTest()
  }, [])

  const fetchTest = async () => {
    const response = await fetch(`/api/tests/${params.id}`)
    const data = await response.json()
    if (data.success) {
      setTest(data.test)
      setAnswers(new Array(data.test.questions.length).fill(null))
    }
  }

  const handleAnswerChange = (questionIndex, optionIndex) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = optionIndex
    setAnswers(newAnswers)
  }

  const submitTest = async () => {
    const userId = userInfo?._id || null;

    const response = await fetch('/api/submit-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testId: test._id, answers,userId }),
    })
    const data = await response.json()
    if (data.success) {
      setSubmitted(true)
      setScore(data.score)
    }
  }

  if (!test) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{test.title}</h1>
      {!submitted ? (
        <>
          {test.questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-6 p-4 border rounded">
              <h2 className="text-xl font-semibold mb-2">{question.question}</h2>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="mb-2">
                  <input
                    type="radio"
                    id={`q${qIndex}-o${oIndex}`}
                    name={`question-${qIndex}`}
                    checked={answers[qIndex] === oIndex}
                    onChange={() => handleAnswerChange(qIndex, oIndex)}
                    className="mr-2"
                  />
                  <label htmlFor={`q${qIndex}-o${oIndex}`}>{option}</label>
                </div>
              ))}
            </div>
          ))}
          <button onClick={submitTest} className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit Test
          </button>
        </>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Test Submitted</h2>
          <p className="text-xl">Your score: {score}/{test.questions.length}</p>
        </div>
      )}
    </div>
  )
}

