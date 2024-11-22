import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoDB";
import Test from "@/Models/Test";
import TestResult from "@/Models/TestResult";

export async function GET(req, { params }) {
  await connectDB();
  try {
    const test = await Test.findById(params.id);
    if (!test) {
      return NextResponse.json({ success: false, message: "Test not found" });
    }

    const scores = await TestResult.find({ test: params.id })
      .populate('user', 'name')
      .sort({ submittedAt: -1 });

    return NextResponse.json({ 
      success: true, 
      scores,
      testTitle: test.title
    });
  } catch (error) {
    console.error("Error fetching test scores:", error);
    return NextResponse.json({ success: false, message: "Error fetching test scores" });
  }
}

