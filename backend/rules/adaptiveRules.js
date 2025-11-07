const Attempt = require("../models/Attempt");
const Question = require("../models/Question");

module.exports = {
  selectNextQuestion: async (userId) => {
    try {
      // 1️⃣ Find last attempt
      const lastAttempt = await Attempt.find({ user: userId }).sort({ createdAt: -1 }).limit(1);

      let nextDifficulty = "medium";

      if (lastAttempt.length > 0) {
        const wasCorrect = lastAttempt[0].isCorrect;
        const difficultyMap = { easy: "medium", medium: wasCorrect ? "hard" : "easy", hard: "hard" };
        nextDifficulty = difficultyMap[lastAttempt[0].question.difficulty || "medium"];
      }

      // 2️⃣ Fetch a random question of that difficulty not already attempted by user
      const attemptedQuestionIds = (await Attempt.find({ user: userId })).map(a => a.question);
      const nextQuestion = await Question.findOne({ difficulty: nextDifficulty, _id: { $nin: attemptedQuestionIds } });

      if (!nextQuestion) {
        // If all questions attempted, pick any remaining question
        return await Question.findOne({ _id: { $nin: attemptedQuestionIds } });
      }

      return nextQuestion;
    } catch (err) {
      console.error("Adaptive Rule Error:", err);
      return null;
    }
  }
};
