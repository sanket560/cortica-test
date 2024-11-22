"use client";

import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/Context/GlobalContext";
import Link from "next/link";

export default function Home() {

  const { userInfo } = useContext(GlobalContext);

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

  if (!userInfo) {
    return (
      <h1 className="text-3xl font-bold text-center mt-10">Cortica Test</h1>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Tests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((test) => (
          <div key={test._id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">{test.title}</h2>
            <p>Questions: {test.questions.length}</p>
            <Link href={`/take-test/${test._id}`} className="bg-blue-500 text-white px-3 py-1 rounded mt-2 inline-block">
              Take Test
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
