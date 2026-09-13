import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ActivitySession from "./pages/ActivitySession";
import Feedback from "./pages/Feedback";
import Chatbot from "./pages/Chatbot";
import Analytics from "./pages/Analytics";

// Other pages
import Books from "./Books";
import GamesSession from "./GamesSession";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/create-account" element={<Signup />} />

        {/* Main Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Wellness Features */}
        <Route path="/activity" element={<ActivitySession />} />
        <Route path="/books" element={<Books />} />
        <Route path="/games" element={<GamesSession />} />

        {/* AI & User Features */}
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/feedback" element={<Feedback />} />

        {/* Analytics */}
        <Route path="/analytics" element={<Analytics />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;