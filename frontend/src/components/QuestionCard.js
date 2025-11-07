import React, { useState } from "react";

const QuestionCard = ({ question, onSubmit }) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(answer);
    setAnswer("");
  };

  return (
    <div style={{ border: "1px solid gray", padding: "15px", margin: "10px 0" }}>
      <h4>{question.title}</h4>
      {question.type === "mcq" && question.options && (
        <select value={answer} onChange={(e) => setAnswer(e.target.value)}>
          <option value="">Select answer</option>
          {question.options.map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>
      )}
      {question.type !== "mcq" && (
        <input
          type="text"
          placeholder="Enter your answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      )}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default QuestionCard;
