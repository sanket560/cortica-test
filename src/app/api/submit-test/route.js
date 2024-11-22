import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoDB";
import Test from "@/Models/Test";
import TestResult from "@/Models/TestResult";

export async function POST(req) {
  await connectDB();
  try {
    const { testId, answers , userId } = await req.json();
    const test = await Test.findById(testId);
    if (!test) {
      return NextResponse.json({ success: false, message: "Test not found" });
    }

    let score = 0;
    for (let i = 0; i < test.questions.length; i++) {
      if (answers[i] === test.questions[i].correctAnswer) {
        score++;
      }
    }

    const testResult = await TestResult.create({
      user: userId,
      test: testId,
      score,
    });

    return NextResponse.json({ success: true, score, testResult });
  } catch (error) {
    console.error("Error submitting test:", error);
    return NextResponse.json({ success: false, message: "Error submitting test" });
  }
}

