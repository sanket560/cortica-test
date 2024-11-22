import mongoose from "mongoose";

const TestResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
});

const TestResult = mongoose.models.TestResult || mongoose.model("TestResult", TestResultSchema);
export default TestResult;

