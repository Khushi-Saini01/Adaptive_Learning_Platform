import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../App.css";

const Dashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const qRes = await API.get("/questions");
        setQuestions(qRes.data.data);

        const pRes = await API.get("/attempts/progress");
        setProgress(pRes.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="container">Loading dashboard...</p>;

  return (
    <div className="container">
      <h2>Dashboard</h2>

      <div className="card">
        <h3>All Questions</h3>
        {questions.length === 0 ? (
          <p>No questions available.</p>
        ) : (
          questions.map((q) => (
            <div key={q._id} className="question-card">
              <h4>{q.title}</h4>
              <p><strong>Difficulty:</strong> {q.difficulty}</p>
              <p><strong>Topic:</strong> {q.topic}</p>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h3>Your Progress</h3>
        {Object.keys(progress).length === 0 ? (
          <p>No progress yet. Start attempting questions!</p>
        ) : (
          Object.keys(progress).map((topic) => (
            <div key={topic} className="progress-wrapper">
              <p>{topic}: {progress[topic]}</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: progress[topic] }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
