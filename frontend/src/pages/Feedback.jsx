import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  Bot,
  Leaf,
  Send,
  CheckCircle,
  Star,
} from "lucide-react";

const API_URL = "http://127.0.0.1:5000";

function Feedback() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("General Feedback");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [previousFeedback, setPreviousFeedback] = useState([]);

  // =========================================================
  // GET LOGGED-IN EMPLOYEE
  // =========================================================

  const getEmployee = () => {
    try {
      const storedEmployee =
        localStorage.getItem("moodMentorEmployee");

      if (!storedEmployee) {
        return null;
      }

      return JSON.parse(storedEmployee);
    } catch (error) {
      console.error("Employee data error:", error);
      return null;
    }
  };

  // =========================================================
  // LOAD PREVIOUS FEEDBACK
  // =========================================================

  const loadPreviousFeedback = async () => {
    const employee = getEmployee();

    if (!employee || !employee.employeeId) {
      console.log("No logged-in employee found.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/feedback/${employee.employeeId}`
      );

      const data = await response.json();

      console.log("Previous feedback response:", data);

      if (response.ok && data.success) {
        setPreviousFeedback(data.feedback || []);
      } else {
        console.error(
          "Unable to load feedback:",
          data.message || data
        );
      }
    } catch (error) {
      console.error("Unable to load feedback:", error);
    }
  };

  useEffect(() => {
    loadPreviousFeedback();
  }, []);

  // =========================================================
  // SUBMIT FEEDBACK
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    const employee = getEmployee();

    if (!employee || !employee.employeeId) {
      setMessage("Please log in again before submitting feedback.");
      setMessageType("error");
      return;
    }

    if (rating === 0) {
      setMessage("Please select a rating.");
      setMessageType("error");
      return;
    }

    if (!feedback.trim()) {
      setMessage("Please enter your feedback.");
      setMessageType("error");
      return;
    }

    if (feedback.trim().length > 500) {
      setMessage("Feedback must be 500 characters or less.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: employee.employeeId,
          category: category,
          rating: rating,
          feedback: feedback.trim(),
        }),
      });

      const data = await response.json();

      console.log("Feedback response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to save feedback."
        );
      }

      setMessage(
        "Thank you! Your feedback has been submitted successfully."
      );
      setMessageType("success");

      setCategory("General Feedback");
      setRating(0);
      setFeedback("");

      await loadPreviousFeedback();

    } catch (error) {
      console.error("Feedback submission error:", error);

      setMessage(
        error.message || "Unable to submit feedback."
      );
      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0b1f] via-[#17102b] to-[#0b0815] text-white">

      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <header className="border-b border-purple-500/10 bg-[#0d0a18]/80 backdrop-blur-xl">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          {/* BRAND */}

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 shadow-lg shadow-purple-500/20">

              <span className="text-xl font-bold">
                M
              </span>

            </div>

            <div>
              <h1 className="text-lg font-bold">
                Mood Mentor
              </h1>

              <p className="text-xs text-gray-500">
                Employee Wellness
              </p>
            </div>

          </div>

          {/* DASHBOARD BUTTON */}

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/5 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-white"
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>

        </div>

      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-5xl px-6 py-10">

        {/* PAGE TITLE */}

        <div className="mb-9">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">

            <MessageCircle size={16} />

            Share your feedback

          </div>

          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">

            Help us make{" "}

            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
              Mood Mentor
            </span>{" "}

            better.

          </h2>

          <p className="mt-4 max-w-2xl leading-relaxed text-gray-400">

            Tell us about your experience with Mood Mentor.
            Your honest feedback helps us improve the AI-powered
            workplace wellness experience.

          </p>

        </div>

        {/* =====================================================
            FEEDBACK FORM
        ===================================================== */}

        <div className="rounded-3xl border border-purple-500/15 bg-[#17132b]/90 p-7 shadow-2xl shadow-purple-950/20 backdrop-blur-xl md:p-9">

          <div className="mb-8">

            <h3 className="text-2xl font-bold">
              How was your experience?
            </h3>

            <p className="mt-2 text-gray-500">
              Your honest feedback helps us make Mood Mentor better.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            {/* CATEGORY */}

            <div className="mb-7">

              <label className="mb-3 block text-sm font-semibold text-gray-300">
                Feedback category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-purple-500/20 bg-[#0f0b1c] px-4 py-3.5 text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              >

                <option className="bg-[#17132b]">
                  General Feedback
                </option>

                <option className="bg-[#17132b]">
                  Dashboard
                </option>

                <option className="bg-[#17132b]">
                  Wellness Activities
                </option>

                <option className="bg-[#17132b]">
                  AI Recommendations
                </option>

                <option className="bg-[#17132b]">
                  User Experience
                </option>

                <option className="bg-[#17132b]">
                  Suggestions
                </option>

              </select>

            </div>

            {/* RATING */}

            <div className="mb-7">

              <label className="mb-3 block text-sm font-semibold text-gray-300">
                How would you rate your experience?
              </label>

              <div className="flex items-center gap-2">

                {[1, 2, 3, 4, 5].map((star) => (

                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="rounded-lg p-1 transition hover:scale-110"
                  >

                    <Star
                      size={34}
                      strokeWidth={1.8}
                      className={
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-600 hover:text-gray-400"
                      }
                    />

                  </button>

                ))}

              </div>

              {rating > 0 && (

                <p className="mt-3 text-sm text-gray-400">

                  You selected{" "}

                  <span className="font-semibold text-purple-400">
                    {rating}/5
                  </span>

                </p>

              )}

            </div>

            {/* FEEDBACK TEXT */}

            <div className="mb-5">

              <div className="mb-3 flex items-center justify-between">

                <label className="text-sm font-semibold text-gray-300">
                  Your feedback
                </label>

                <span className="text-xs text-gray-500">
                  {feedback.length}/500
                </span>

              </div>

              <textarea
                value={feedback}
                onChange={(e) =>
                  setFeedback(e.target.value.slice(0, 500))
                }
                placeholder="Tell us what you liked, what could be improved, or any suggestions..."
                rows="6"
                maxLength="500"
                className="w-full resize-none rounded-2xl border border-purple-500/15 bg-[#0f0b1c] px-5 py-4 text-white placeholder-gray-600 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />

            </div>

            {/* SUCCESS / ERROR MESSAGE */}

            {message && (

              <div
                className={`mb-5 flex items-center gap-3 rounded-xl border px-4 py-4 text-sm ${
                  messageType === "success"
                    ? "border-purple-500/20 bg-purple-500/10 text-purple-300"
                    : "border-red-500/20 bg-red-500/10 text-red-400"
                }`}
              >

                {messageType === "success" ? (
                  <CheckCircle size={19} />
                ) : (
                  <span>⚠️</span>
                )}

                <span>
                  {message}
                </span>

              </div>

            )}

            {/* SUBMIT BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 px-6 py-4 font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:from-indigo-500 hover:via-purple-500 hover:to-violet-500 hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Feedback
                </>
              )}

            </button>

          </form>

        </div>

        {/* =====================================================
            PREVIOUS FEEDBACK
        ===================================================== */}

        {previousFeedback.length > 0 && (

          <div className="mt-8 rounded-3xl border border-purple-500/15 bg-[#17132b]/90 p-7 shadow-xl shadow-purple-950/10 md:p-9">

            <div className="mb-6">

              <h3 className="text-2xl font-bold">
                Your Previous Feedback
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Your submitted feedback and ratings.
              </p>

            </div>

            <div className="space-y-4">

              {previousFeedback.map((item) => (

                <div
                  key={item.id}
                  className="rounded-2xl border border-purple-500/10 bg-[#0f0b1c] p-5 transition hover:border-purple-500/30 hover:bg-[#140f25]"
                >

                  <div className="flex flex-wrap items-center justify-between gap-3">

                    <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300">
                      {item.category}
                    </span>

                    <div className="flex">

                      {[1, 2, 3, 4, 5].map((star) => (

                        <Star
                          key={star}
                          size={16}
                          className={
                            star <= item.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-700"
                          }
                        />

                      ))}

                    </div>

                  </div>

                  <p className="mt-4 leading-relaxed text-gray-300">
                    {item.feedback}
                  </p>

                  {item.createdAt && (

                    <p className="mt-3 text-xs text-gray-600">
                      {new Date(
                        item.createdAt
                      ).toLocaleString()}
                    </p>

                  )}

                </div>

              ))}

            </div>

          </div>

        )}

        {/* =====================================================
            INFORMATION CARDS
        ===================================================== */}

        <div className="mt-8 grid gap-5 md:grid-cols-3">

          {/* YOUR VOICE */}

          <div className="rounded-2xl border border-purple-500/10 bg-[#17132b]/90 p-6 transition hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-950/20">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-purple-400">

              <MessageCircle size={21} />

            </div>

            <h4 className="mt-5 font-bold">
              Your voice matters
            </h4>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Your feedback helps us understand what employees
              need from Mood Mentor.
            </p>

          </div>

          {/* AI MENTOR */}

          <div className="rounded-2xl border border-purple-500/10 bg-[#17132b]/90 p-6 transition hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-950/20">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 text-violet-400">

              <Bot size={21} />

            </div>

            <h4 className="mt-5 font-bold">
              Improve AI Mentor
            </h4>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Your suggestions can help improve AI recommendations
              and wellness activities.
            </p>

          </div>

          {/* WELLBEING */}

          <div className="rounded-2xl border border-purple-500/10 bg-[#17132b]/90 p-6 transition hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-950/20">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-400">

              <Leaf size={21} />

            </div>

            <h4 className="mt-5 font-bold">
              Better wellbeing
            </h4>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Small improvements can create a better workplace
              wellness experience.
            </p>

          </div>

        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="py-10 text-center">

          <p className="text-sm text-gray-600">
            Mood Mentor
          </p>

          <p className="mt-1 text-xs text-gray-700">
            Your AI-powered wellness companion 💜
          </p>

        </div>

      </main>

    </div>
  );
}

export default Feedback;