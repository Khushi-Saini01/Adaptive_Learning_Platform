const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Question title is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["mcq", "coding", "short-answer"],
      default: "mcq",
      required: true,
    },
    options: {
      type: [String],
      validate: {
        validator: function (v) {
          // MCQs must have at least 2 options
          if (this.type === "mcq") return Array.isArray(v) && v.length >= 2;
          return true; // Other types can ignore options
        },
        message: "MCQ questions must have at least 2 options",
      },
    },
    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required"],
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
    },
    bloomLevel: {
      type: String,
      enum: ["remember", "understand", "apply", "analyze", "evaluate", "create"],
      default: "understand",
    },
    skills: {
      type: [String],
      required: [true, "At least one skill is required"],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one skill must be provided",
      },
    },
    explanation: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } // Adds createdAt & updatedAt automatically
);

module.exports = mongoose.model("Question", QuestionSchema);
