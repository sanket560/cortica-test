import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoDB";
import Test from "@/Models/Test";

export async function GET(req, { params }) {
  await connectDB();
  try {
    const test = await Test.findById(params.id);
    if (!test) {
      return NextResponse.json({ success: false, message: "Test not found" });
    }
    return NextResponse.json({ success: true, test });
  } catch (error) {
    console.error("Error fetching test:", error);
    return NextResponse.json({ success: false, message: "Error fetching test" });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { title, questions } = await req.json();
    const updatedTest = await Test.findByIdAndUpdate(
      params.id,
      { title, questions },
      { new: true }
    );
    if (!updatedTest) {
      return NextResponse.json({ success: false, message: "Test not found" });
    }
    return NextResponse.json({ success: true, test: updatedTest });
  } catch (error) {
    console.error("Error updating test:", error);
    return NextResponse.json({ success: false, message: "Error updating test" });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const deletedTest = await Test.findByIdAndDelete(params.id);
    if (!deletedTest) {
      return NextResponse.json({ success: false, message: "Test not found" });
    }
    return NextResponse.json({ success: true, message: "Test deleted successfully" });
  } catch (error) {
    console.error("Error deleting test:", error);
    return NextResponse.json({ success: false, message: "Error deleting test" });
  }
}

