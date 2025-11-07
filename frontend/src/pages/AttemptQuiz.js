import React, { useEffect, useState } from "react";
import API from "../services/api";
import QuestionCard from "../components/QuestionCard";

const AttemptQuiz = () => {
  const [question, setQuestion] = useState(null);
  const [msg, setMsg] = useState("");

  const fetchNextQuestion = async () => {
    try {
      const res = await API.get("/attempts/next-question");
      setQuestion(res.data.data);
    } catch (err) {
      setMsg("No more questions available!");
    }
  };

  useEffect(() => {
    fetchNextQuestion();
  }, []);

  const handleAnswerSubmit = async (answer) => {
    try {
      await API.post("/attempts", { questionId: question._id, isCorrect: answer === question.correctAnswer });
      setMsg(answer === question.correctAnswer ? "Correct!" : `Incorrect! Correct: ${question.correctAnswer}`);
      fetchNextQuestion();
    } catch (err) {
      setMsg("Error submitting answer");
    }
  };

  return (
    <div>
      <h2>Attempt Quiz</h2>
      {msg && <p>{msg}</p>}
      {question && <QuestionCard question={question} onSubmit={handleAnswerSubmit} />}
    </div>
  );
};

export default AttemptQuiz;
