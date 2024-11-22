import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoDB";
import Test from "@/Models/Test";

export async function GET() {
  await connectDB();
  try {
    const tests = await Test.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, tests });
  } catch (error) {
    console.error("Error fetching tests:", error);
    return NextResponse.json({ success: false, message: "Error fetching tests" });
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const { title, questions, userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" });
    }
    const newTest = await Test.create({ title, questions, createdBy: userId });
    return NextResponse.json({ success: true, test: newTest });
  } catch (error) {
    console.error("Error creating test:", error);
    return NextResponse.json({ success: false, message: "Error creating test" });
  }
}

