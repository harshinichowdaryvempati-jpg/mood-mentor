import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Pause,
  Play,
  CheckCircle2,
  Wind,
  Smartphone,
  Sparkles,
  Moon,
  AlertTriangle,
  BookOpen,
} from "lucide-react";

/* =========================================================
   ACTIVITY DATA
========================================================= */

const ACTIVITY_DATA = {
  relaxation: {
    title: "10 min Relaxation",
    duration: 10 * 60,
    icon: Sparkles,
    points: 5,
    intro:
      "Relax your body and prepare yourself for a peaceful evening.",
    steps: [
      "Find a comfortable position and relax your shoulders.",
      "Take a slow, deep breath through your nose.",
      "Hold gently for a moment.",
      "Breathe out slowly and release the tension in your body.",
      "Let your breathing return to a comfortable rhythm.",
    ],
  },

  breathing: {
    title: "5 min Mindful Breathing",
    duration: 5 * 60,
    icon: Wind,
    points: 5,
    intro:
      "Release the tension you may have built up throughout the day.",
    steps: [
      "Breathe in slowly for 4 seconds.",
      "Hold your breath for 2 seconds.",
      "Breathe out slowly for 6 seconds.",
      "Repeat this gentle rhythm and focus on your breath.",
    ],
  },

  winddown: {
    title: "Digital Wind-down",
    duration: 3 * 60,
    icon: Smartphone,
    points: 4,
    intro:
      "Take a quiet break away from your screen and recharge.",
    steps: [
      "Put your phone and other screens aside.",
      "Sit comfortably and soften your gaze.",
      "Notice three things around you.",
      "Take a few slow breaths and enjoy the quiet moment.",
      "When you feel ready, slowly return to your evening.",
    ],
  },

  aiReset: {
    title: "3-minute Evening Reset",
    duration: 3 * 60,
    icon: Moon,
    points: 5,
    intro:
      "A short guided reset to help you release the day and transition into a calmer evening.",
    steps: [
      "Put down what you are working on and sit comfortably.",
      "Take a slow breath in through your nose.",
      "Breathe out gently and let your shoulders relax.",
      "Notice how your body feels without trying to change anything.",
      "Take one final slow breath and allow yourself to move into the evening calmly.",
    ],
  },
};

/* =========================================================
   MOOD RECOMMENDATIONS
========================================================= */

const MOOD_RECOMMENDATIONS = {
  Great: {
    emoji: "😊",
    bookTitle: "The Little Book of Positivity",
    bookDescription:
      "A short positive reading to help you maintain your good mood.",
    bookFile: "/books/positivity.pdf",
    message:
      "You're feeling great! Keep your positive energy going with something uplifting.",
  },

  Good: {
    emoji: "🙂",
    bookTitle: "The Calm Mind",
    bookDescription:
      "A peaceful read for maintaining balance during your day.",
    bookFile: "/books/calm-mind.pdf",
    message:
      "You're doing well. A light read can help you maintain this feeling.",
  },

  Okay: {
    emoji: "😐",
    bookTitle: "Mindfulness for Everyday Life",
    bookDescription:
      "A gentle mindfulness reading for slowing down and reconnecting with yourself.",
    bookFile: "/books/mindfulness.pdf",
    message:
      "Your mood seems neutral right now. A few quiet pages may help you reset.",
  },

  Low: {
    emoji: "😔",
    bookTitle: "A Gentle Guide to Better Days",
    bookDescription:
      "A supportive reading to help you slow down and take care of yourself.",
    bookFile: "/books/better-days.pdf",
    message:
      "It sounds like you're having a difficult moment. Take things slowly and give yourself some space.",
  },

  Stressed: {
    emoji: "😣",
    bookTitle: "The Stress-Free Mind",
    bookDescription:
      "A calming reading focused on managing stress and finding balance.",
    bookFile: "/books/stress-free.pdf",
    message:
      "You seem stressed right now. A few quiet moments of reading may help you reset.",
  },
};

/* =========================================================
   TIME FORMAT
========================================================= */

const formatTime = (seconds) => {
  const safeSeconds = Math.max(0, Number(seconds) || 0);

  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");

  const remainingSeconds = (safeSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
};

/* =========================================================
   COMPONENT
========================================================= */

const ActivitySession = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const requestedActivity = location.state?.activity;

  const activityKey = ACTIVITY_DATA[requestedActivity]
    ? requestedActivity
    : "relaxation";

  const activity = ACTIVITY_DATA[activityKey];

  const Icon = activity.icon;

  /* =======================================================
     TIMER
  ======================================================= */

  const [timeLeft, setTimeLeft] = useState(activity.duration);
  const [isRunning, setIsRunning] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  /* =======================================================
     MOOD
  ======================================================= */

  const [currentMood, setCurrentMood] = useState("Okay");

  /* =======================================================
     LOAD MOOD
  ======================================================= */

  useEffect(() => {
    try {
      const savedMood = localStorage.getItem("moodMentorMood");

      if (savedMood && MOOD_RECOMMENDATIONS[savedMood]) {
        setCurrentMood(savedMood);
      }
    } catch (error) {
      console.error("Unable to read mood:", error);
    }
  }, []);

  /* =======================================================
     SAVE CURRENT MOOD
  ======================================================= */

  useEffect(() => {
    try {
      localStorage.setItem("moodMentorMood", currentMood);
    } catch (error) {
      console.error("Unable to save mood:", error);
    }
  }, [currentMood]);

  /* =======================================================
     RECOMMENDATION
  ======================================================= */

  const recommendation =
    MOOD_RECOMMENDATIONS[currentMood] ||
    MOOD_RECOMMENDATIONS.Okay;

  /* =======================================================
     TIMER
  ======================================================= */

  useEffect(() => {
    if (!isRunning || completed) {
      return undefined;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          clearInterval(timer);

          setIsRunning(false);
          setCompleted(true);

          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isRunning, completed]);

  /* =======================================================
     SAVE COMPLETED ACTIVITY
  ======================================================= */

  useEffect(() => {
    if (!completed || saved) {
      return;
    }

    try {
      const storedData = localStorage.getItem(
        "moodMentorCompletedActivities"
      );

      let existingActivities = [];

      try {
        existingActivities = storedData
          ? JSON.parse(storedData)
          : [];
      } catch {
        existingActivities = [];
      }

      if (!Array.isArray(existingActivities)) {
        existingActivities = [];
      }

      const completedActivity = {
        id: Date.now(),
        activity: activity.title,
        activityType: activityKey,
        points: activity.points,
        mood: currentMood,
        completedAt: new Date().toISOString(),
        date: new Date().toISOString().split("T")[0],
      };

      existingActivities.push(completedActivity);

      localStorage.setItem(
        "moodMentorCompletedActivities",
        JSON.stringify(existingActivities)
      );

      setSaved(true);
    } catch (error) {
      console.error(
        "Unable to save completed activity:",
        error
      );
    }
  }, [
    completed,
    saved,
    activity.title,
    activityKey,
    activity.points,
    currentMood,
  ]);

  /* =======================================================
     OPEN BOOK
  ======================================================= */

  const openBook = () => {
    navigate("/books");
  };

  /* =======================================================
     PROGRESS
  ======================================================= */

  const progress =
    activity.duration > 0
      ? ((activity.duration - timeLeft) / activity.duration) * 100
      : 0;

  const safeProgress = Math.min(100, Math.max(0, progress));

  /* =======================================================
     EXIT
  ======================================================= */

  const exitWithoutSaving = () => {
    setShowExitConfirm(false);
    navigate("/dashboard");
  };

  /* =======================================================
     PAUSE / RESUME
  ======================================================= */

  const togglePause = () => {
    setIsRunning((previous) => !previous);
  };

  /* =======================================================
     COMPLETION SCREEN
  ======================================================= */

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#080B14] via-[#111A3A] to-[#0B0815] flex items-center justify-center px-4 py-8">

        <div className="w-full max-w-lg bg-[#0D1324]/95 rounded-3xl shadow-2xl shadow-black/30 border border-white/10 p-8 text-center">

          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-violet-500/15 flex items-center justify-center mb-6">
            <CheckCircle2
              size={44}
              className="text-violet-400"
            />
          </div>

          <h1 className="text-3xl font-bold text-white">
            Session Complete!
          </h1>

          <p className="text-zinc-400 mt-3">
            You completed your{" "}
            <span className="font-semibold text-zinc-200">
              {activity.title.toLowerCase()}
            </span>
            .
          </p>

          <div className="mt-5 inline-flex items-center gap-2 bg-violet-500/10 text-violet-300 px-4 py-2 rounded-full text-sm font-semibold">
            +{activity.points} wellness points
          </div>

          <p className="text-violet-400 font-medium mt-5">
            Your mind deserves this pause. ✨
          </p>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full mt-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-500 hover:via-purple-500 hover:to-violet-500 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-purple-500/20"
          >
            Back to Dashboard
          </button>

        </div>
      </div>
    );
  }

  /* =======================================================
     ACTIVE SESSION
  ======================================================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080B14] via-[#111A3A] to-[#0B0815] px-4 py-8">

      <div className="max-w-4xl mx-auto">

        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() => setShowExitConfirm(true)}
          className="flex items-center gap-2 text-zinc-400 hover:text-violet-400 mb-6 transition"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {/* MAIN CARD */}

        <div className="bg-[#0D1324]/95 rounded-3xl shadow-2xl shadow-black/30 border border-white/10 p-6 sm:p-10">

          {/* HEADER */}

          <div className="text-center">

            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-violet-500/15 flex items-center justify-center mb-4">

              <Icon
                size={30}
                className="text-violet-400"
              />

            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold mb-3">
              <Sparkles size={14} />
              AI Wellness Session
            </div>

            <h1 className="text-3xl font-bold text-white">
              {activity.title}
            </h1>

            <p className="text-zinc-400 mt-2 max-w-xl mx-auto">
              {activity.intro}
            </p>

          </div>

          {/* TIMER */}

          <div className="my-10 flex justify-center">

            <div className="relative w-56 h-56 rounded-full border-8 border-violet-400/15 flex items-center justify-center">

              <div
                className="absolute inset-0 rounded-full border-8 border-violet-500 border-t-transparent transition-all duration-500"
                style={{
                  transform: `rotate(${safeProgress * 3.6}deg)`,
                }}
              />

              <div className="text-center relative z-10">

                <p className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                  {formatTime(timeLeft)}
                </p>

                <p className="text-sm text-zinc-400 mt-2">
                  {isRunning
                    ? "Session in progress"
                    : "Paused"}
                </p>

              </div>

            </div>

          </div>

          {/* PROGRESS BAR */}

          <div className="mb-8">

            <div className="flex justify-between text-xs text-zinc-500 mb-2">

              <span>Progress</span>

              <span>
                {Math.round(safeProgress)}%
              </span>

            </div>

            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">

              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 transition-all duration-500"
                style={{
                  width: `${safeProgress}%`,
                }}
              />

            </div>

          </div>

          {/* GUIDANCE */}

          <div className="bg-gradient-to-br from-[#111A3A] via-[#17102B] to-[#0D1324] rounded-2xl p-5 mb-8 border border-violet-400/15">

            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles
                size={18}
                className="text-violet-400"
              />
              Your guidance
            </h2>

            <div className="space-y-4">

              {activity.steps.map((step, index) => (
                <div
                  key={`${activityKey}-${index}`}
                  className="flex gap-3"
                >

                  <div className="w-7 h-7 shrink-0 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white text-sm flex items-center justify-center shadow-sm">
                    {index + 1}
                  </div>

                  <p className="text-zinc-300 leading-relaxed">
                    {step}
                  </p>

                </div>
              ))}

            </div>

          </div>

          {/* SESSION CONTROLS */}

          <div className="flex flex-col sm:flex-row gap-3 mb-10">

            <button
              type="button"
              onClick={togglePause}
              className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-500 hover:via-purple-500 hover:to-violet-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-purple-500/20"
            >

              {isRunning ? (
                <Pause size={19} />
              ) : (
                <Play size={19} />
              )}

              {isRunning ? "Pause" : "Resume"}

            </button>

            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="px-6 border border-red-400/20 text-red-400 hover:bg-red-500/10 font-semibold py-3 rounded-xl transition"
            >
              End Session
            </button>

          </div>

          {/* PERSONALIZED RECOMMENDATION */}

          <div className="border-t border-white/10 pt-8">

            <div className="text-center mb-7">

              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 text-violet-300 px-4 py-2 rounded-full text-sm font-semibold mb-3 border border-violet-400/15">

                <span>{recommendation.emoji}</span>

                Based on your mood: {currentMood}

              </div>

              <h2 className="text-2xl font-bold text-white">
                Personalized for you
              </h2>

              <p className="text-zinc-400 mt-2">
                {recommendation.message}
              </p>

            </div>

            {/* BOOK CARD */}

            <div className="bg-gradient-to-br from-[#111A3A] via-[#0D1324] to-[#17102B] rounded-2xl p-6 border border-violet-400/15">

              <div className="flex items-start gap-4">

                <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-violet-500/15 flex items-center justify-center">

                  <BookOpen
                    size={26}
                    className="text-violet-400"
                  />

                </div>

                <div className="flex-1">

                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                    A peaceful read
                  </p>

                  <h3 className="text-xl font-bold text-white mt-1">
                    {recommendation.bookTitle}
                  </h3>

                  <p className="text-zinc-400 text-sm mt-1">
                    {recommendation.bookDescription}
                  </p>

                  <button
                    type="button"
                    onClick={openBook}
                    className="mt-4 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-500 hover:via-purple-500 hover:to-violet-500 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-md shadow-purple-500/20"
                  >

                    <BookOpen size={18} />

                    Open Book

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* EXIT CONFIRMATION MODAL */}

      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

          <button
            type="button"
            aria-label="Close confirmation"
            onClick={() => setShowExitConfirm(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="relative z-10 w-full max-w-md bg-[#0D1324]/95 rounded-3xl shadow-2xl shadow-black/30 border border-white/10 p-6">

            <div className="flex items-center justify-center mb-5">

              <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center">

                <AlertTriangle
                  size={28}
                  className="text-amber-400"
                />

              </div>

            </div>

            <h2 className="text-xl font-bold text-white text-center">
              End this session?
            </h2>

            <p className="text-zinc-400 text-sm text-center mt-3 leading-relaxed">
              This session has not been completed yet.
              If you leave now, it will not be added to
              your wellness history and no points will be
              awarded.
            </p>

            <div className="flex flex-col gap-3 mt-6">

              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-500 hover:via-purple-500 hover:to-violet-500 text-white font-semibold py-3 rounded-xl transition"
              >
                Continue Session
              </button>

              <button
                type="button"
                onClick={exitWithoutSaving}
                className="w-full border border-red-400/20 text-red-400 hover:bg-red-500/10 font-semibold py-3 rounded-xl transition"
              >
                Exit Without Saving
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default ActivitySession;