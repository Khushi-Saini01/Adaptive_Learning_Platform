const express = require("express");
const router = express.Router();
const Attempt = require("../models/Attempt");
const Question = require("../models/Question");
const adaptiveRules = require("../rules/adaptiveRules");
const { protect } = require("../middleware/authMiddleware"); // Correct import

// -------------------- LOG ATTEMPT --------------------
router.post("/", protect, async (req, res) => {
  try {
    const { questionId, isCorrect } = req.body;
    const userId = req.user._id; // Get user from JWT

    if (!questionId || isCorrect === undefined) {
      return res.status(400).json({ success: false, message: "questionId and isCorrect are required" });
    }

    let attempt = await Attempt.findOne({ user: userId, question: questionId });
    if (attempt) {
      attempt.attempts += 1;
      attempt.isCorrect = isCorrect;
    } else {
      attempt = new Attempt({ user: userId, question: questionId, isCorrect });
    }

    await attempt.save();
    res.json({ success: true, message: "Attempt logged", data: attempt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------- GET NEXT QUESTION --------------------
router.get("/next-question", protect, async (req, res) => {
  try {
    const userId = req.user._id; // Get user from JWT

    const nextQuestion = await adaptiveRules.selectNextQuestion(userId);

    if (!nextQuestion) {
      return res.status(404).json({ success: false, message: "No questions available" });
    }

    res.json({ success: true, data: nextQuestion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------- GET USER PROGRESS --------------------
router.get("/progress", protect, async (req, res) => {
  try {
    const userId = req.user._id; // Get user from JWT

    const attempts = await Attempt.find({ user: userId }).populate("question");

    const progress = {};
    attempts.forEach(a => {
      const topic = a.question.topic;
      if (!progress[topic]) progress[topic] = { total: 0, correct: 0 };
      progress[topic].total += 1;
      if (a.isCorrect) progress[topic].correct += 1;
    });

    const topicProgress = {};
    for (let topic in progress) {
      topicProgress[topic] = ((progress[topic].correct / progress[topic].total) * 100).toFixed(2) + "%";
    }

    res.json({ success: true, data: topicProgress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
