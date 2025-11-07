import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddQuestion from "./pages/AddQuestion";
import AttemptQuiz from "./pages/AttemptQuiz";

// Landing Page
const Landing = () => (
  <div className="container" style={{ position: "relative", overflow: "hidden" }}>
    {/* Floating Particles */}
    {[...Array(40)].map((_, i) => (
      <div
        key={i}
        className="particle"
        style={{
          width: `${Math.random() * 8 + 5}px`,
          height: `${Math.random() * 8 + 5}px`,
          left: `${Math.random() * 100}%`,
          backgroundColor: `hsl(${Math.random() * 360}, 90%, 70%)`,
          boxShadow: `0 0 10px hsl(${Math.random() * 360}, 90%, 70%)`,
          animationDuration: `${10 + Math.random() * 15}s`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      ></div>
    ))}

    <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
      Welcome to Adaptive Learning Platform
    </h2>

    <div className="card" style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
      <h3>Get Started</h3>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "15px",
        }}
      >
        <a href="/login"><button className="landing-btn">Login</button></a>
        <a href="/register"><button className="landing-btn">Register</button></a>
        <a href="/attempt-quiz"><button className="landing-btn">Attempt Quiz</button></a>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-question"
          element={
            <ProtectedRoute>
              <AddQuestion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attempt-quiz"
          element={
            <ProtectedRoute>
              <AttemptQuiz />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
