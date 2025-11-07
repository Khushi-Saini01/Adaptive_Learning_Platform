import React, { useState } from "react";
import API from "../services/api";
import "../App.css";

const AddQuestion = () => {
  const [form, setForm] = useState({
    title: "",
    type: "mcq",
    options: ["", "", "", ""],
    correctAnswer: "",
    topic: "",
    skills: [""],
    bloomLevel: "remember",
    difficulty: "medium",
    explanation: ""
  });

  const [msg, setMsg] = useState("");

  // Handle input changes
  const handleChange = (e, index = null, field = null) => {
    const { name, value } = e.target;

    if (field === "options" && index !== null) {
      const newOptions = [...form.options];
      newOptions[index] = value;
      setForm({ ...form, options: newOptions });
    } else if (field === "skills" && index !== null) {
      const newSkills = [...form.skills];
      newSkills[index] = value;
      setForm({ ...form, skills: newSkills });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Add new skill input dynamically
  const addSkillField = () => {
    setForm({ ...form, skills: [...form.skills, ""] });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/questions/add", form);
      setMsg("✅ Question added successfully!");
      // Reset form
      setForm({
        title: "",
        type: "mcq",
        options: ["", "", "", ""],
        correctAnswer: "",
        topic: "",
        skills: [""],
        bloomLevel: "remember",
        difficulty: "medium",
        explanation: ""
      });
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Error adding question");
    }
  };

  return (
    <div className="add-question-container">
      <h2>Add Question</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Question Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="mcq">MCQ</option>
          <option value="coding">Coding</option>
          <option value="short-answer">Short Answer</option>
        </select>

        {form.type === "mcq" && (
          <>
            <label>Options:</label>
            {form.options.map((opt, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => handleChange(e, idx, "options")}
                required
              />
            ))}
          </>
        )}

        <input
          type="text"
          name="correctAnswer"
          placeholder="Correct Answer"
          value={form.correctAnswer}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="topic"
          placeholder="Topic"
          value={form.topic}
          onChange={handleChange}
          required
        />

        <label>Skills:</label>
        {form.skills.map((skill, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Skill ${idx + 1}`}
            value={skill}
            onChange={(e) => handleChange(e, idx, "skills")}
            required
          />
        ))}
        <button type="button" onClick={addSkillField}>
          + Add Skill
        </button>

        <select name="bloomLevel" value={form.bloomLevel} onChange={handleChange}>
          <option value="remember">Remember</option>
          <option value="understand">Understand</option>
          <option value="apply">Apply</option>
          <option value="analyze">Analyze</option>
          <option value="evaluate">Evaluate</option>
          <option value="create">Create</option>
        </select>

        <select name="difficulty" value={form.difficulty} onChange={handleChange}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <input
          type="text"
          name="explanation"
          placeholder="Explanation"
          value={form.explanation}
          onChange={handleChange}
        />

        <button type="submit">Add Question</button>
      </form>
    </div>
  );
};

export default AddQuestion;
