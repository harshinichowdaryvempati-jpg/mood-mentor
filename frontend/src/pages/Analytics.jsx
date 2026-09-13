import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  ChevronLeft,
  TrendingUp,
  Target,
  Flame,
  Heart,
  Activity,
  CalendarDays,
  CheckCircle2,
  MessageSquare,
  BookOpen,
  Gamepad2,
  BarChart3,
  Sparkles,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:5000";

/* =========================================================
   SAFE LOCAL STORAGE
========================================================= */

const getStoredArray = (key) => {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    return [];
  }
};

/* =========================================================
   MOOD INFORMATION
========================================================= */

const MOOD_INFO = {
  Great: {
    emoji: "😊",
    score: 100,
  },

  Good: {
    emoji: "🙂",
    score: 80,
  },

  Okay: {
    emoji: "😐",
    score: 60,
  },

  Low: {
    emoji: "😔",
    score: 40,
  },

  Stressed: {
    emoji: "😣",
    score: 30,
  },
};

/* =========================================================
   NORMALIZE MOOD
========================================================= */

const normalizeMood = (value) => {
  if (!value) {
    return "";
  }

  const cleaned = String(value).trim().toLowerCase();

  const moodMap = {
    great: "Great",
    good: "Good",
    okay: "Okay",
    ok: "Okay",
    low: "Low",
    stressed: "Stressed",
  };

  return moodMap[cleaned] || "";
};

/* =========================================================
   GET MOOD FROM RECORD
========================================================= */

const getMoodFromRecord = (item) => {
  return normalizeMood(
    item?.mood ||
      item?.value ||
      item?.emotion ||
      item?.mood_name ||
      item?.moodName
  );
};

/* =========================================================
   GET MOOD TIMESTAMP
========================================================= */

const getMoodTimestamp = (item) => {
  return (
    item?.created_at ||
    item?.createdAt ||
    item?.date ||
    item?.timestamp ||
    ""
  );
};

/* =========================================================
   CALCULATE STREAK
========================================================= */

const calculateStreak = (activities) => {
  if (!activities.length) {
    return 0;
  }

  const dates = [
    ...new Set(
      activities
        .map(
          (activity) =>
            activity.date ||
            activity.completedAt ||
            activity.completed_at
        )
        .filter(Boolean)
        .map((date) => new Date(date).toDateString())
    ),
  ]
    .map((date) => new Date(date))
    .sort((a, b) => b - a);

  if (!dates.length) {
    return 0;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const latestDate = new Date(dates[0]);
  latestDate.setHours(0, 0, 0, 0);

  const difference = Math.floor(
    (today - latestDate) / (1000 * 60 * 60 * 24)
  );

  if (difference > 1) {
    return 0;
  }

  let streak = 1;

  for (let i = 0; i < dates.length - 1; i++) {
    const currentDate = new Date(dates[i]);
    const previousDate = new Date(dates[i + 1]);

    currentDate.setHours(0, 0, 0, 0);
    previousDate.setHours(0, 0, 0, 0);

    const dayDifference = Math.floor(
      (currentDate - previousDate) /
        (1000 * 60 * 60 * 24)
    );

    if (dayDifference === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Recently";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   GET USER
========================================================= */

const getStoredUser = () => {
  try {
    const stored =
      localStorage.getItem("moodMentorEmployee") ||
      localStorage.getItem("user") ||
      localStorage.getItem("currentUser");

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error("Unable to load user:", error);
    return null;
  }
};

/* =========================================================
   ANALYTICS
========================================================= */

const Analytics = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [moodHistory, setMoodHistory] = useState([]);

  const [feedbackHistory, setFeedbackHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  /* =======================================================
     LOAD USER + ANALYTICS DATA
  ======================================================= */

  useEffect(() => {
    const loadAnalytics = async () => {
      const storedUser = getStoredUser();

      setUser(storedUser);

      const employeeId =
        storedUser?.employeeId ||
        storedUser?.employee_id ||
        localStorage.getItem("moodMentorEmployeeId") ||
        "";

      /* -----------------------------------------------
         MOOD HISTORY FROM FLASK
      ------------------------------------------------ */

      if (employeeId) {
        try {
          const moodResponse = await fetch(
            `${API_BASE_URL}/api/mood/${employeeId}`
          );

          if (moodResponse.ok) {
            const moodData = await moodResponse.json();

            if (Array.isArray(moodData)) {
              setMoodHistory(moodData);
            } else if (Array.isArray(moodData.moods)) {
              setMoodHistory(moodData.moods);
            } else if (Array.isArray(moodData.checkins)) {
              setMoodHistory(moodData.checkins);
            } else {
              setMoodHistory([]);
            }
          }
        } catch (error) {
          console.error(
            "Unable to load mood history:",
            error
          );
        }

        /* ---------------------------------------------
           FEEDBACK HISTORY FROM FLASK
        --------------------------------------------- */

        try {
          const feedbackResponse = await fetch(
            `${API_BASE_URL}/api/feedback/${employeeId}`
          );

          if (feedbackResponse.ok) {
            const feedbackData =
              await feedbackResponse.json();

            if (Array.isArray(feedbackData)) {
              setFeedbackHistory(feedbackData);
            } else if (
              Array.isArray(feedbackData.feedback)
            ) {
              setFeedbackHistory(
                feedbackData.feedback
              );
            } else {
              setFeedbackHistory([]);
            }
          }
        } catch (error) {
          console.error(
            "Unable to load feedback history:",
            error
          );
        }
      }

      setLoading(false);
    };

    loadAnalytics();
  }, []);

  /* =======================================================
     LOCAL ACTIVITY DATA
  ======================================================= */

  const completedActivities = useMemo(
    () =>
      getStoredArray(
        "moodMentorCompletedActivities"
      ),
    []
  );

  const completedBooks = useMemo(
    () =>
      getStoredArray(
        "moodMentorCompletedBooks"
      ),
    []
  );

  const completedGames = useMemo(
    () =>
      getStoredArray(
        "moodMentorCompletedGames"
      ),
    []
  );

  /* =======================================================
     ACTIVITY POINTS
  ======================================================= */

  const activityPoints = useMemo(() => {
    return completedActivities.reduce(
      (total, activity) =>
        total + (Number(activity.points) || 0),
      0
    );
  }, [completedActivities]);

  const gamePoints = completedGames.length * 10;

  const bookPoints = completedBooks.length * 10;

  const totalPoints =
    activityPoints +
    gamePoints +
    bookPoints;

  /* =======================================================
     CURRENT MOOD
  ======================================================= */

  const latestMood = useMemo(() => {
    /*
      IMPORTANT:
      If backend history exists, use the newest
      backend check-in instead of localStorage.

      This prevents localStorage and database
      values from showing different moods.
    */

    if (moodHistory.length > 0) {
      const sortedMoods = [...moodHistory].sort(
        (a, b) => {
          const timeA = new Date(
            getMoodTimestamp(a)
          ).getTime();

          const timeB = new Date(
            getMoodTimestamp(b)
          ).getTime();

          if (
            Number.isNaN(timeA) &&
            Number.isNaN(timeB)
          ) {
            return 0;
          }

          if (Number.isNaN(timeA)) {
            return -1;
          }

          if (Number.isNaN(timeB)) {
            return 1;
          }

          return timeA - timeB;
        }
      );

      return getMoodFromRecord(
        sortedMoods[sortedMoods.length - 1]
      );
    }

    return normalizeMood(
      localStorage.getItem("moodMentorMood") || ""
    );
  }, [moodHistory]);

  /* =======================================================
     CURRENT MOOD SCORE
  ======================================================= */

  const currentMoodScore =
    MOOD_INFO[latestMood]?.score || 0;

  /* =======================================================
     AVERAGE MOOD
  ======================================================= */

  const averageMood = useMemo(() => {
    if (!moodHistory.length) {
      return currentMoodScore;
    }

    const scores = moodHistory
      .map((item) => {
        const mood = getMoodFromRecord(item);

        const storedScore = Number(item?.score);

        return storedScore > 0
          ? storedScore
          : MOOD_INFO[mood]?.score || 0;
      })
      .filter((score) => score > 0);

    if (!scores.length) {
      return currentMoodScore;
    }

    const total = scores.reduce(
      (sum, score) => sum + score,
      0
    );

    return Math.round(
      total / scores.length
    );
  }, [moodHistory, currentMoodScore]);

  /* =======================================================
     MOOD COUNTS
  ======================================================= */

  const moodCounts = useMemo(() => {
    const counts = {
      Great: 0,
      Good: 0,
      Okay: 0,
      Low: 0,
      Stressed: 0,
    };

    moodHistory.forEach((item) => {
      const mood = getMoodFromRecord(item);

      if (counts[mood] !== undefined) {
        counts[mood]++;
      }
    });

    /*
      Only use localStorage as a fallback when
      there is NO backend mood history.
    */

    if (
      moodHistory.length === 0 &&
      latestMood &&
      counts[latestMood] === 0
    ) {
      counts[latestMood] = 1;
    }

    return counts;
  }, [moodHistory, latestMood]);

  const totalMoodCheckins = Object.values(
    moodCounts
  ).reduce(
    (total, count) => total + count,
    0
  );

  const maxMoodCount = Math.max(
    ...Object.values(moodCounts),
    1
  );

  /* =======================================================
     STREAK
  ======================================================= */

  const streak = calculateStreak(
    completedActivities
  );

  /* =======================================================
     WELLNESS LEVEL
  ======================================================= */

  const wellnessLevel =
    totalPoints >= 100
      ? "Excellent"
      : totalPoints >= 60
      ? "Strong"
      : totalPoints >= 30
      ? "Growing"
      : "Getting Started";

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    localStorage.removeItem("user");

    localStorage.removeItem("currentUser");

    localStorage.removeItem("token");

    localStorage.removeItem(
      "moodMentorLoggedIn"
    );

    localStorage.removeItem(
      "moodMentorEmployee"
    );

    localStorage.removeItem(
      "moodMentorEmployeeId"
    );

    navigate("/");
  };

  /* =======================================================
     USER NAME
  ======================================================= */

  const getUserName = () => {
    if (!user) {
      return "there";
    }

    return (
      user.fullName ||
      user.full_name ||
      user.name ||
      user.username ||
      user.email?.split("@")[0] ||
      "there"
    );
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080B14] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-400" />

          <p className="text-sm text-zinc-400">
            Loading your wellness analytics...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#080B14] text-white">

      {/* =================================================
          BACKGROUND GLOW
      ================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#080B14]/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

          {/* LOGO */}

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-600 shadow-lg shadow-purple-900/30">
              <Brain
                size={24}
                className="text-white"
              />
            </div>

            <div className="text-left">
              <h1 className="text-lg font-bold text-white">
                Mood Mentor
              </h1>

              <p className="text-xs text-zinc-500">
                AI Wellness Companion
              </p>
            </div>
          </button>

          {/* NAVIGATION */}

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="hidden rounded-xl px-4 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white sm:block"
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => navigate("/chatbot")}
              className="hidden rounded-xl px-4 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white sm:block"
            >
              AI Mentor
            </button>

            <button
              type="button"
              onClick={() => navigate("/feedback")}
              className="hidden rounded-xl px-4 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white sm:block"
            >
              Feedback
            </button>

            {/* USER */}

            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-2 py-2 sm:px-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-600 font-semibold text-white">
                {getUserName()
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white">
                  {getUserName()}
                </p>

                <p className="text-[11px] text-purple-400">
                  Wellness Analytics
                </p>
              </div>
            </div>

            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-500 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* BACK */}

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-white"
        >
          <ChevronLeft size={17} />

          Back to Dashboard
        </button>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative mb-7 overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#17113A] via-[#15102F] to-[#0D0920] p-7 shadow-2xl shadow-purple-950/20 sm:p-9">

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple-500/15 blur-3xl" />

          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-purple-300">
              <Sparkles size={13} />

              Personal Wellness Analytics
            </div>

            <h2 className="text-3xl font-bold sm:text-4xl">
              Your Wellness Journey,{" "}

              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-violet-300 bg-clip-text text-transparent">
                {getUserName()}
              </span>
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Track your mood, wellness activities,
              progress and positive habits in one place.
            </p>

          </div>
        </section>

        {/* =================================================
            MAIN STATS
        ================================================= */}

        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* MOOD */}

          <div className="rounded-3xl border border-indigo-500/20 bg-[#0D1324] p-5 shadow-xl shadow-black/20">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                <Heart size={23} />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                Mood
              </span>
            </div>

            <p className="text-3xl font-bold text-white">
              {averageMood}

              <span className="text-lg text-zinc-500">
                /100
              </span>
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Average Mood Score
            </p>
          </div>

          {/* SESSIONS */}

          <div className="rounded-3xl border border-purple-500/20 bg-[#0D1324] p-5 shadow-xl shadow-black/20">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
                <Activity size={23} />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">
                Sessions
              </span>
            </div>

            <p className="text-3xl font-bold text-white">
              {completedActivities.length}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Completed Activities
            </p>
          </div>

          {/* STREAK */}

          <div className="rounded-3xl border border-violet-500/20 bg-[#0D1324] p-5 shadow-xl shadow-black/20">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                <Flame size={23} />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">
                Streak
              </span>
            </div>

            <p className="text-3xl font-bold text-white">
              {streak}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Active Days
            </p>
          </div>

          {/* POINTS */}

          <div className="rounded-3xl border border-fuchsia-500/20 bg-[#0D1324] p-5 shadow-xl shadow-black/20">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-300">
                <Target size={23} />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-400">
                Progress
              </span>
            </div>

            <p className="text-3xl font-bold text-white">
              {totalPoints}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Wellness Points
            </p>
          </div>

        </section>

        {/* =================================================
            MOOD OVERVIEW + WELLNESS LEVEL
        ================================================= */}

        <section className="mb-7 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* MOOD CHART */}

          <div className="rounded-3xl border border-white/10 bg-[#0D1324] p-6 shadow-xl shadow-black/20 lg:col-span-2">

            <div className="mb-7 flex items-center justify-between">

              <div>

                <div className="mb-2 flex items-center gap-2 text-purple-300">
                  <BarChart3 size={19} />

                  <span className="text-xs font-bold uppercase tracking-widest">
                    Mood Overview
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white">
                  How you've been feeling
                </h3>
              </div>

              <div className="rounded-xl bg-purple-500/10 px-3 py-2 text-xs font-semibold text-purple-300">
                {totalMoodCheckins}{" "}
                {totalMoodCheckins === 1
                  ? "check-in"
                  : "check-ins"}
              </div>

            </div>

            <div className="space-y-5">

              {Object.entries(MOOD_INFO).map(
                ([moodName, info]) => {

                  const count =
                    moodCounts[moodName];

                  const width =
                    count === 0
                      ? 3
                      : Math.max(
                          (count /
                            maxMoodCount) *
                            100,
                          8
                        );

                  return (
                    <div key={moodName}>

                      <div className="mb-2 flex items-center justify-between">

                        <div className="flex items-center gap-2">

                          <span className="text-xl">
                            {info.emoji}
                          </span>

                          <span className="text-sm font-semibold text-zinc-300">
                            {moodName}
                          </span>

                        </div>

                        <span className="text-xs font-semibold text-zinc-500">
                          {count}{" "}
                          {count === 1
                            ? "check-in"
                            : "check-ins"}
                        </span>

                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-white/5">

                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 transition-all duration-700"
                          style={{
                            width: `${width}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          </div>

          {/* WELLNESS LEVEL */}

          <div className="relative overflow-hidden rounded-3xl border border-purple-400/20 bg-gradient-to-br from-[#19133B] via-[#14102E] to-[#0D0A1D] p-6 shadow-xl shadow-purple-950/20">

            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-purple-500/15 blur-3xl" />

            <div className="relative">

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-violet-500/20 text-purple-300">
                <TrendingUp size={27} />
              </div>

              <p className="text-xs font-bold uppercase tracking-widest text-purple-400">
                Wellness Level
              </p>

              <h3 className="mt-2 text-3xl font-bold text-white">
                {wellnessLevel}
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Keep building small, healthy habits.
                Every completed activity contributes
                to your wellness journey.
              </p>

              <div className="mt-7">

                <div className="mb-2 flex justify-between text-xs">

                  <span className="text-zinc-500">
                    Progress
                  </span>

                  <span className="font-bold text-purple-300">
                    {Math.min(totalPoints, 100)}%
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/5">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500"
                    style={{
                      width: `${Math.min(
                        totalPoints,
                        100
                      )}%`,
                    }}
                  />

                </div>

              </div>

            </div>
          </div>

        </section>

        {/* =================================================
            WELLNESS BREAKDOWN
        ================================================= */}

        <section className="mb-7">

          <div className="mb-5">

            <p className="text-xs font-bold uppercase tracking-widest text-purple-400">
              Your Activities
            </p>

            <h3 className="mt-1 text-2xl font-bold text-white">
              Wellness Progress
            </h3>

          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* ACTIVITIES */}

            <div className="rounded-3xl border border-indigo-500/15 bg-[#0D1324] p-6">

              <div className="mb-5 flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                  <Activity size={23} />
                </div>

                <div>

                  <p className="text-sm text-zinc-500">
                    Wellness Activities
                  </p>

                  <p className="text-2xl font-bold text-white">
                    {completedActivities.length}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2 text-xs text-indigo-300">
                <CheckCircle2 size={14} />

                {activityPoints} points earned
              </div>

            </div>

            {/* BOOKS */}

            <div className="rounded-3xl border border-purple-500/15 bg-[#0D1324] p-6">

              <div className="mb-5 flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
                  <BookOpen size={23} />
                </div>

                <div>

                  <p className="text-sm text-zinc-500">
                    Books Completed
                  </p>

                  <p className="text-2xl font-bold text-white">
                    {completedBooks.length}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2 text-xs text-purple-300">
                <CheckCircle2 size={14} />

                {bookPoints} points earned
              </div>

            </div>

            {/* GAMES */}

            <div className="rounded-3xl border border-violet-500/15 bg-[#0D1324] p-6">

              <div className="mb-5 flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                  <Gamepad2 size={23} />
                </div>

                <div>

                  <p className="text-sm text-zinc-500">
                    Games Completed
                  </p>

                  <p className="text-2xl font-bold text-white">
                    {completedGames.length}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2 text-xs text-violet-300">
                <CheckCircle2 size={14} />

                {gamePoints} points earned
              </div>

            </div>

          </div>
        </section>

        {/* =================================================
            RECENT ACTIVITY
        ================================================= */}

        <section className="mb-7 rounded-3xl border border-white/10 bg-[#0D1324] p-6 shadow-xl shadow-black/20">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <div className="mb-2 flex items-center gap-2 text-purple-300">

                <CalendarDays size={18} />

                <span className="text-xs font-bold uppercase tracking-widest">
                  Activity History
                </span>

              </div>

              <h3 className="text-2xl font-bold text-white">
                Recent Wellness Activities
              </h3>

            </div>

          </div>

          {completedActivities.length > 0 ? (

            <div className="space-y-3">

              {[...completedActivities]
                .reverse()
                .slice(0, 6)
                .map((activity, index) => (

                  <div
                    key={`${activity.activity || "activity"}-${index}`}
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-purple-400/20 hover:bg-purple-500/5"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
                        <CheckCircle2 size={19} />
                      </div>

                      <div>

                        <p className="font-semibold text-white">
                          {activity.activity ||
                            activity.activityName ||
                            "Wellness Activity"}
                        </p>

                        <p className="mt-1 text-xs text-zinc-600">
                          {formatDate(
                            activity.date ||
                              activity.completedAt ||
                              activity.completed_at
                          )}
                        </p>

                      </div>

                    </div>

                    <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300">
                      +{activity.points || 0} pts
                    </span>

                  </div>

                ))}

            </div>

          ) : (

            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">

              <div className="mb-3 text-4xl">
                🌱
              </div>

              <p className="font-semibold text-white">
                No activities completed yet
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Complete a wellness activity to
                start building your progress.
              </p>

            </div>
          )}

        </section>

        {/* =================================================
            FEEDBACK SUMMARY
        ================================================= */}

        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* FEEDBACK */}

          <div className="rounded-3xl border border-white/10 bg-[#0D1324] p-6">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                <MessageSquare size={21} />
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                  Feedback
                </p>

                <h3 className="text-xl font-bold text-white">
                  Your Voice Matters
                </h3>

              </div>

            </div>

            <div className="flex items-end gap-3">

              <span className="text-4xl font-bold text-white">
                {feedbackHistory.length}
              </span>

              <span className="pb-1 text-sm text-zinc-500">
                feedback submissions
              </span>

            </div>

            <p className="mt-4 text-sm leading-6 text-zinc-500">
              Your feedback helps improve the Mood
              Mentor wellness experience.
            </p>

            <button
              type="button"
              onClick={() => navigate("/feedback")}
              className="mt-5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-violet-600 px-4 py-2.5 text-sm font-bold text-white transition hover:from-indigo-400 hover:via-purple-500 hover:to-violet-500"
            >
              View Feedback
            </button>

          </div>

          {/* CURRENT STATUS */}

          <div className="rounded-3xl border border-purple-500/15 bg-gradient-to-br from-[#15102F] to-[#0D0A1D] p-6">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
                <Heart size={21} />
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-widest text-purple-400">
                  Current Status
                </p>

                <h3 className="text-xl font-bold text-white">
                  Today's Wellness
                </h3>

              </div>

            </div>

            {latestMood ? (

              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-4xl">
                  {MOOD_INFO[latestMood]?.emoji}
                </div>

                <div>

                  <p className="text-sm text-zinc-500">
                    Latest mood
                  </p>

                  <p className="text-xl font-bold text-white">
                    {latestMood}
                  </p>

                  <p className="mt-1 text-xs text-purple-300">
                    Score: {currentMoodScore}/100
                  </p>

                </div>

              </div>

            ) : (

              <div>

                <p className="font-semibold text-white">
                  No mood check-in yet
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  Return to your Dashboard and
                  complete your daily check-in.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/dashboard")
                  }
                  className="mt-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-violet-600 px-4 py-2.5 text-sm font-bold text-white"
                >
                  Check In
                </button>

              </div>
            )}

          </div>

        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="border-t border-white/10 py-7 text-center">

          <div className="flex items-center justify-center gap-2">

            <Brain
              size={16}
              className="text-purple-400"
            />

            <p className="text-sm text-zinc-500">
              Mood Mentor • Your AI-powered wellness companion
            </p>

          </div>

          <p className="mt-1 text-xs text-zinc-700">
            Take care of your mind, one day at a time 💜
          </p>

        </footer>

      </main>
    </div>
  );
};

export default Analytics;