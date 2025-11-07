const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const { protect, authorize } = require("../middleware/authMiddleware");

// -------------------- ADD QUESTION (Protected, Instructor/Admin only) --------------------
router.post("/add", protect, authorize("instructor", "admin"), async (req, res) => {
  try {
    const { title, type, correctAnswer, topic, skills, options, bloomLevel, difficulty, explanation } = req.body;

    if (!title || !type || !correctAnswer || !topic || !skills || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title, type, correctAnswer, topic, and at least one skill are required",
      });
    }

    const question = new Question({ title, type, options, correctAnswer, topic, skills, bloomLevel, difficulty, explanation });
    await question.save();

    res.status(201).json({ success: true, message: "Question added successfully", data: question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------- GET ALL QUESTIONS --------------------
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json({ success: true, data: questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------- GET QUESTIONS BY TOPIC --------------------
router.get("/topic/:topic", async (req, res) => {
  try {
    const questions = await Question.find({ topic: req.params.topic });
    res.json({ success: true, data: questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------- GET QUESTIONS WITH FILTERS --------------------
router.get("/filter", async (req, res) => {
  try {
    const filters = { ...req.query };
    const questions = await Question.find(filters);
    res.json({ success: true, data: questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
