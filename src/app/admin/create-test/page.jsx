"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { GlobalContext } from "@/Context/GlobalContext";

export default function CreateTest() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const { userInfo } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false)
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", ""], correctAnswer: 0 },
    ]);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const submitTest = async (e) => {
    setLoading(true)
    const userId = userInfo?._id || null;
    e.preventDefault();
    const response = await fetch("/api/tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, questions,userId }),
    });
    const data = await response.json();
    if (data.success) {
      router.push("/admin/dashboard");
    }
    setLoading(false)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Test</h1>
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
              onChange={(e) =>
                updateQuestion(qIndex, "question", e.target.value)
              }
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
                  onChange={() =>
                    updateQuestion(qIndex, "correctAnswer", oIndex)
                  }
                  required
                />
              </div>
            ))}
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestion}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Question
        </button>
        <button
          type="submit"
          className="bg-blue-500 mx-4 text-white px-4 py-2 rounded"
        >
          {loading ? 'loading...' : 'Create Test'}
        </button>
      </form>
    </div>
  );
}
