import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Bot,
  MessageSquare,
  LogOut,
  Play,
  Heart,
  Flame,
  Target,
  Sparkles,
  Wind,
  Smartphone,
  Moon,
  Music2,
  ExternalLink,
  ChevronRight,
  Clock3,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = "http://127.0.0.1:5000";

/* =========================================================
   MOODS
========================================================= */

const MOODS = [
  {
    name: "Great",
    emoji: "😊",
    value: "Great",
    score: 100,
  },
  {
    name: "Good",
    emoji: "🙂",
    value: "Good",
    score: 80,
  },
  {
    name: "Okay",
    emoji: "😐",
    value: "Okay",
    score: 60,
  },
  {
    name: "Low",
    emoji: "😔",
    value: "Low",
    score: 40,
  },
  {
    name: "Stressed",
    emoji: "😣",
    value: "Stressed",
    score: 30,
  },
];

/* =========================================================
   WELLNESS ACTIVITIES
========================================================= */

const ACTIVITIES = [
  {
    key: "relaxation",
    emoji: "🧘",
    icon: Heart,
    title: "10 min Relaxation",
    description:
      "Relax your body and prepare yourself for a peaceful evening.",
    duration: "10 min",
    points: 5,
  },
  {
    key: "breathing",
    emoji: "🌬️",
    icon: Wind,
    title: "5 min Mindful Breathing",
    description:
      "Release tension and focus on slow, mindful breathing.",
    duration: "5 min",
    points: 5,
  },
  {
    key: "winddown",
    emoji: "📱",
    icon: Smartphone,
    title: "Digital Wind-down",
    description:
      "Take a quiet break away from your screen and recharge.",
    duration: "3 min",
    points: 4,
  },
  {
    key: "aiReset",
    emoji: "🌙",
    icon: Moon,
    title: "3-minute Evening Reset",
    description:
      "A short guided reset to help you transition into a calmer evening.",
    duration: "3 min",
    points: 5,
  },
];

/* =========================================================
   MUSIC OPTIONS
========================================================= */

const MUSIC_OPTIONS = [
  {
    id: 1,
    title: "Peaceful English",
    language: "English",
    category: "Calm",
    emoji: "🌿",
    description:
      "Soft and peaceful English songs for a calmer mind.",
    moods: ["Low", "Stressed", "Okay"],
    search:
      "https://open.spotify.com/search/peaceful%20english%20songs",
  },
  {
    id: 2,
    title: "Peaceful Telugu",
    language: "Telugu",
    category: "Calm",
    emoji: "🌸",
    description:
      "Gentle Telugu songs for relaxation and reflection.",
    moods: ["Low", "Stressed", "Okay"],
    search:
      "https://open.spotify.com/search/peaceful%20telugu%20songs",
  },
  {
    id: 3,
    title: "Relaxing Hindi",
    language: "Hindi",
    category: "Relax",
    emoji: "🌙",
    description:
      "Relaxing Hindi music for quiet and peaceful moments.",
    moods: ["Low", "Stressed", "Okay"],
    search:
      "https://open.spotify.com/search/relaxing%20hindi%20songs",
  },
  {
    id: 4,
    title: "Happy English",
    language: "English",
    category: "Happy",
    emoji: "☀️",
    description:
      "Positive English songs to keep your good mood going.",
    moods: ["Great", "Good"],
    search:
      "https://open.spotify.com/search/happy%20english%20songs",
  },
  {
    id: 5,
    title: "Feel-Good Telugu",
    language: "Telugu",
    category: "Happy",
    emoji: "💚",
    description:
      "Feel-good Telugu songs for positive energy.",
    moods: ["Great", "Good"],
    search:
      "https://open.spotify.com/search/feel%20good%20telugu%20songs",
  },
  {
    id: 6,
    title: "Happy Hindi",
    language: "Hindi",
    category: "Happy",
    emoji: "✨",
    description:
      "Upbeat Hindi music for positive vibes.",
    moods: ["Great", "Good"],
    search:
      "https://open.spotify.com/search/happy%20hindi%20songs",
  },
];

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
    (today - latestDate) /
      (1000 * 60 * 60 * 24)
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
   DASHBOARD
========================================================= */

const Dashboard = () => {
  const navigate = useNavigate();

  /* =======================================================
     USER
  ======================================================= */

  const [user, setUser] = useState(null);

  /* =======================================================
     MOOD
  ======================================================= */

  const [mood, setMood] = useState("");
  const [journal, setJournal] = useState("");

  /* =======================================================
     MUSIC
  ======================================================= */

  const [musicLanguage, setMusicLanguage] =
    useState("All");

  const [musicCategory, setMusicCategory] =
    useState("All");

  /* =======================================================
     UI
  ======================================================= */

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* =======================================================
     STATS
  ======================================================= */

  const [stats, setStats] = useState({
    sessions: 0,
    streak: 0,
    moodScore: 0,
    points: 0,
  });

  /* =======================================================
     LOAD USER
     
     IMPORTANT:
     moodMentorEmployee is checked FIRST.
     This is the employee saved after login.
  ======================================================= */

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("moodMentorEmployee") ||
        localStorage.getItem("user") ||
        localStorage.getItem("currentUser");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        console.log(
          "Logged-in employee:",
          parsedUser
        );

        setUser(parsedUser);
      } else {
        console.warn(
          "No logged-in employee found in localStorage."
        );
      }
    } catch (error) {
      console.error(
        "Unable to load user:",
        error
      );
    }
  }, []);

  /* =======================================================
     LOAD MOOD
  ======================================================= */

  useEffect(() => {
    try {
      const savedMood =
        localStorage.getItem("moodMentorMood");

      if (
        savedMood &&
        MOODS.some(
          (item) => item.value === savedMood
        )
      ) {
        setMood(savedMood);
      }
    } catch (error) {
      console.error(
        "Unable to load mood:",
        error
      );
    }
  }, []);

  /* =======================================================
     LOAD STATISTICS
  ======================================================= */

  const loadLocalStats = () => {
    const activities = getStoredArray(
      "moodMentorCompletedActivities"
    );

    const sessions = activities.length;

    const points = activities.reduce(
      (total, activity) =>
        total +
        (Number(activity.points) || 0),
      0
    );

    const streak = calculateStreak(
      activities
    );

    const savedMood =
      localStorage.getItem(
        "moodMentorMood"
      );

    const moodScores = {
      Great: 100,
      Good: 80,
      Okay: 60,
      Low: 40,
      Stressed: 30,
    };

    const moodScore =
      moodScores[savedMood] || 0;

    setStats({
      sessions,
      streak,
      points,
      moodScore,
    });
  };

  /* =======================================================
     INITIAL STATISTICS
  ======================================================= */

  useEffect(() => {
    loadLocalStats();

    const handleStorageChange = () => {
      loadLocalStats();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  /* =======================================================
     REFRESH WHEN USER RETURNS
  ======================================================= */

  useEffect(() => {
    const handleFocus = () => {
      loadLocalStats();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, []);

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
     EMPLOYEE ID
  ======================================================= */

  const getEmployeeId = () => {
    return (
      user?.employeeId ||
      user?.employee_id ||
      localStorage.getItem(
        "moodMentorEmployeeId"
      ) ||
      ""
    );
  };

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
     START ACTIVITY
  ======================================================= */

  const handleStartActivity = (
    activityKey = "relaxation"
  ) => {
    navigate("/activity", {
      state: {
        activity: activityKey,
      },
    });
  };

  /* =======================================================
     SPOTIFY
  ======================================================= */

  const handleSpotify = (url) => {
    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =======================================================
     MUSIC MESSAGE
  ======================================================= */

  const getMusicMessage = () => {
    switch (mood) {
      case "Great":
        return {
          title:
            "Keep the good vibes going! ☀️",
          description:
            "You're feeling great. Enjoy some positive music and keep that energy flowing.",
        };

      case "Good":
        return {
          title:
            "Let's keep your mood positive 💜",
          description:
            "Here are some feel-good songs to complement your mood.",
        };

      case "Okay":
        return {
          title:
            "Let's create a calmer moment 🌿",
          description:
            "A little music can help you slow down and reset.",
        };

      case "Low":
        return {
          title:
            "A gentle moment for you 💜",
          description:
            "Choose some comforting music and give yourself a little time to breathe.",
        };

      case "Stressed":
        return {
          title:
            "Let's help you slow down 🌙",
          description:
            "Try some calming music while you take a few slow breaths.",
        };

      default:
        return {
          title:
            "Music for your wellness journey 🎧",
          description:
            "Choose music based on how you're feeling right now.",
        };
    }
  };

  /* =======================================================
     SAVE MOOD
  ======================================================= */

  const handleMoodSubmit = async () => {
    if (!mood) {
      setMessage(
        "Please select your mood first."
      );

      return;
    }

    setLoading(true);
    setMessage("");

    /* SAVE LOCALLY */

    try {
      localStorage.setItem(
        "moodMentorMood",
        mood
      );
    } catch (error) {
      console.error(
        "Unable to save mood:",
        error
      );
    }

    /* UPDATE SCORE */

    const selectedMood = MOODS.find(
      (item) => item.value === mood
    );

    setStats((previous) => ({
      ...previous,
      moodScore:
        selectedMood?.score || 0,
    }));

    /* SEND TO FLASK */

    try {
      const employeeId =
        getEmployeeId();

      if (!employeeId) {
        setMessage(
          "Mood saved on your device. Employee ID was not found."
        );

        setLoading(false);
        setJournal("");

        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/mood`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            employeeId,
            mood,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        setMessage(
          "Mood check-in saved successfully! 💜"
        );
      } else {
        setMessage(
          data.message ||
            "Mood saved locally, but the server could not save it."
        );
      }
    } catch (error) {
      console.error(
        "Mood API error:",
        error
      );

      setMessage(
        "Mood saved on your device. Server is currently unavailable."
      );
    } finally {
      setLoading(false);
    }

    setJournal("");
  };

  /* =======================================================
     COMPLETED ACTIVITIES
  ======================================================= */

  const completedActivities =
    getStoredArray(
      "moodMentorCompletedActivities"
    );

  const latestActivity =
    completedActivities.length > 0
      ? completedActivities[
          completedActivities.length - 1
        ]
      : null;

  /* =======================================================
     FILTER MUSIC
  ======================================================= */

  const filteredMusicOptions =
    MUSIC_OPTIONS.filter((music) => {
      const languageMatch =
        musicLanguage === "All" ||
        music.language ===
          musicLanguage;

      const categoryMatch =
        musicCategory === "All" ||
        music.category ===
          musicCategory;

      return (
        languageMatch &&
        categoryMatch
      );
    });

  /* =======================================================
     SORT MUSIC BY MOOD
  ======================================================= */

  const sortedMusicOptions = [
    ...filteredMusicOptions,
  ].sort((a, b) => {
    if (!mood) {
      return 0;
    }

    const aMatch =
      a.moods.includes(mood);

    const bMatch =
      b.moods.includes(mood);

    if (aMatch && !bMatch) {
      return -1;
    }

    if (!aMatch && bMatch) {
      return 1;
    }

    return 0;
  });

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#080b14] text-white">

      {/* ===================================================
          BACKGROUND GLOW
      =================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-cyan-600/5 blur-3xl" />

      </div>

      {/* ===================================================
          NAVBAR
      =================================================== */}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#080b14]/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

          {/* LOGO */}

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 shadow-lg shadow-blue-900/30">

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
              onClick={() =>
                navigate("/chatbot")
              }
              className="hidden rounded-xl border border-transparent px-4 py-2 text-sm font-medium text-zinc-400 transition hover:border-white/10 hover:bg-white/5 hover:text-white sm:block"
            >
              AI Mentor
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/feedback")
              }
              className="hidden rounded-xl border border-transparent px-4 py-2 text-sm font-medium text-zinc-400 transition hover:border-white/10 hover:bg-white/5 hover:text-white sm:block"
            >
              Feedback
            </button>

            {/* USER */}

            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-2 py-2 sm:px-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">

                {getUserName()
                  .charAt(0)
                  .toUpperCase()}

              </div>

              <div className="hidden sm:block">

                <p className="text-sm font-semibold text-white">
                  {getUserName()}
                </p>

                <p className="text-[11px] text-cyan-400">
                  Welcome back
                </p>

              </div>

            </div>

            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-zinc-500 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 sm:w-auto sm:px-4"
            >

              <LogOut
                size={17}
              />

              <span className="ml-2 hidden sm:block">
                Logout
              </span>

            </button>

          </div>

        </div>

      </nav>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative mb-6 overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-[#101b3b] via-[#11183a] to-[#1b1238] p-6 shadow-2xl shadow-blue-950/30 sm:p-8">

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300">

                <Sparkles
                  size={13}
                />

                AI-Powered Wellness

              </div>

              <h2 className="text-3xl font-bold leading-tight sm:text-4xl">

                How are you feeling today,{" "}

                <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">

                  {getUserName()}

                </span>

                ?

              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">

                Take a moment to check in with yourself.
                Your mental well-being matters every day.

              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                handleStartActivity(
                  "relaxation"
                )
              }
              className="flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-900/30 transition hover:-translate-y-0.5 hover:shadow-xl"
            >

              <Play
                size={17}
                fill="currentColor"
              />

              Start Wellness Activity

            </button>

          </div>

        </section>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* TOTAL */}

          <div className="group rounded-3xl border border-blue-500/15 bg-[#0d1324] p-5 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-blue-400/30">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">

                <Target
                  size={23}
                />

              </div>

              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                Total
              </span>

            </div>

            <p className="text-3xl font-bold text-white">
              {stats.sessions}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Wellness Sessions
            </p>

          </div>

          {/* STREAK */}

          <div className="group rounded-3xl border border-purple-500/15 bg-[#0d1324] p-5 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-purple-400/30">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">

                <Flame
                  size={23}
                />

              </div>

              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">
                Current
              </span>

            </div>

            <p className="text-3xl font-bold text-white">
              {stats.streak}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Day Streak
            </p>

          </div>

          {/* SCORE */}

          <div className="group rounded-3xl border border-cyan-500/15 bg-[#0d1324] p-5 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-400/30">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">

                <Heart
                  size={23}
                />

              </div>

              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                Score
              </span>

            </div>

            <p className="text-3xl font-bold text-white">
              {stats.moodScore}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Wellness Score
            </p>

          </div>

        </section>

        {/* =================================================
            MOOD + WELLNESS
        ================================================= */}

        <section className="mb-7 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* MOOD CHECK */}

          <div className="rounded-3xl border border-white/10 bg-[#0d1324] p-6 shadow-xl shadow-black/20 lg:col-span-2">

            <div className="mb-6">

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold tracking-wider text-cyan-300">

                🧠 DAILY CHECK-IN

              </div>

              <h3 className="text-2xl font-bold text-white">
                How are you feeling?
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Choose the emotion that best describes
                how you feel right now.
              </p>

            </div>

            {/* MOODS */}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">

              {MOODS.map((item) => (

                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setMood(item.value);
                    setMessage("");
                  }}
                  className={`rounded-2xl border p-4 transition ${
                    mood === item.value
                      ? "border-cyan-400/50 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-purple-500/15 shadow-lg shadow-blue-900/20 ring-1 ring-cyan-400/20"
                      : "border-white/5 bg-[#12192a] hover:border-blue-400/30 hover:bg-blue-500/10"
                  }`}
                >

                  <div className="text-3xl">
                    {item.emoji}
                  </div>

                  <p
                    className={`mt-2 text-sm font-semibold ${
                      mood === item.value
                        ? "text-cyan-300"
                        : "text-zinc-400"
                    }`}
                  >
                    {item.name}
                  </p>

                </button>

              ))}

            </div>

            {/* JOURNAL */}

            <div className="mt-6">

              <label
                htmlFor="journal"
                className="mb-2 block text-sm font-semibold text-zinc-300"
              >
                Want to tell us more?
              </label>

              <textarea
                id="journal"
                value={journal}
                onChange={(event) =>
                  setJournal(
                    event.target.value
                  )
                }
                placeholder="Write a few thoughts about your day..."
                rows={4}
                className="w-full resize-none rounded-2xl border border-white/10 bg-[#111827] p-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/10"
              />

            </div>

            {/* MESSAGE */}

            {message && (

              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-300">

                <CheckCircle2
                  size={16}
                />

                {message}

              </div>

            )}

            {/* SAVE */}

            <button
              type="button"
              onClick={handleMoodSubmit}
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-900/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  Save Mood Check-in
                  <ChevronRight
                    size={17}
                  />
                </>
              )}

            </button>

          </div>

          {/* WELLNESS MATTERS */}

          <div className="relative overflow-hidden rounded-3xl border border-purple-400/20 bg-gradient-to-br from-[#17133b] via-[#12163a] to-[#0e2140] p-6 shadow-xl shadow-purple-950/20">

            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-purple-500/15 blur-3xl" />

            <div className="relative">

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10 text-3xl">
                🌱
              </div>

              <h3 className="text-xl font-bold text-white">
                Your Mental Wellness Matters
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Small daily actions can make a meaningful
                difference. Take some time today to breathe,
                reflect, and care for yourself.
              </p>

              <div className="mt-7 space-y-5">

                <div className="flex items-start gap-3">

                  <span className="text-xl">
                    🧘
                  </span>

                  <div>
                    <p className="font-semibold text-white">
                      Take a mindful moment
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Slow down and focus on your breathing.
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-3">

                  <span className="text-xl">
                    💭
                  </span>

                  <div>
                    <p className="font-semibold text-white">
                      Reflect on your feelings
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Understanding your emotions is a strength.
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-3">

                  <span className="text-xl">
                    🌟
                  </span>

                  <div>
                    <p className="font-semibold text-white">
                      Celebrate small wins
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Every positive step counts.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            WELLNESS ACTIVITIES
        ================================================= */}

        <section className="mb-8">

          <div className="mb-5">

            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-400/15 bg-purple-400/10 px-3 py-1 text-[10px] font-bold tracking-wider text-purple-300">

              🌿 WELLNESS

            </div>

            <h3 className="text-2xl font-bold text-white">
              Wellness Activities
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Choose an activity that matches what you
              need right now.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {ACTIVITIES.map((activity) => {

              const ActivityIcon =
                activity.icon;

              return (

                <div
                  key={activity.key}
                  className="group rounded-3xl border border-white/10 bg-[#0d1324] p-5 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-blue-400/25 hover:shadow-blue-950/20"
                >

                  <div className="flex items-start gap-4">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-3xl transition group-hover:scale-105">
                      {activity.emoji}
                    </div>

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center justify-between gap-2">

                        <h4 className="text-lg font-bold text-white">
                          {activity.title}
                        </h4>

                        <span className="rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                          +{activity.points} pts
                        </span>

                      </div>

                      <p className="mt-2 text-sm leading-6 text-zinc-500">
                        {activity.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between">

                        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">

                          <Clock3
                            size={13}
                          />

                          {activity.duration}

                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleStartActivity(
                              activity.key
                            )
                          }
                          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-blue-900/20 transition hover:from-cyan-400 hover:to-purple-500"
                        >

                          Start

                          <ChevronRight
                            size={15}
                          />

                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        </section>

        {/* =================================================
            SPOTIFY MUSIC
        ================================================= */}

        <section className="mb-8 overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#10152d] via-[#111331] to-[#1b1033] p-6 shadow-2xl shadow-purple-950/20 sm:p-8">

          {/* HEADER */}

          <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <div>

              <div className="mb-3 flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/15 text-purple-300">

                  <Music2
                    size={18}
                  />

                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Mood Music
                </span>

              </div>

              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                {getMusicMessage().title}
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                {getMusicMessage().description}
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                handleSpotify(
                  "https://open.spotify.com/"
                )
              }
              className="flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/30 transition hover:-translate-y-0.5"
            >

              <Music2
                size={17}
              />

              Open Spotify

              <ExternalLink
                size={14}
              />

            </button>

          </div>

          {/* CURRENT MOOD */}

          {mood && (

            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">

              <span className="text-2xl">
                {
                  MOODS.find(
                    (item) =>
                      item.value === mood
                  )?.emoji
                }
              </span>

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                  Your current mood
                </p>

                <p className="text-sm font-bold text-white">
                  {mood}
                </p>

              </div>

              <span className="ml-auto rounded-full border border-purple-400/15 bg-purple-400/10 px-3 py-1 text-[10px] font-bold text-purple-300">
                Personalized for you
              </span>

            </div>

          )}

          {/* FILTERS */}

          <div className="mb-7 grid grid-cols-1 gap-5 rounded-2xl border border-white/10 bg-black/10 p-5 sm:grid-cols-2">

            {/* LANGUAGE */}

            <div>

              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Language
              </p>

              <div className="flex flex-wrap gap-2">

                {[
                  "All",
                  "English",
                  "Telugu",
                  "Hindi",
                ].map((language) => (

                  <button
                    key={language}
                    type="button"
                    onClick={() =>
                      setMusicLanguage(
                        language
                      )
                    }
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      musicLanguage ===
                      language
                        ? "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white shadow-md"
                        : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {language}
                  </button>

                ))}

              </div>

            </div>

            {/* CATEGORY */}

            <div>

              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Mood & Style
              </p>

              <div className="flex flex-wrap gap-2">

                {[
                  "All",
                  "Calm",
                  "Relax",
                  "Happy",
                ].map((category) => (

                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setMusicCategory(
                        category
                      )
                    }
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      musicCategory ===
                      category
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md"
                        : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>

                ))}

              </div>

            </div>

          </div>

          {/* MUSIC CARDS */}

          {sortedMusicOptions.length > 0 ? (

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {sortedMusicOptions.map(
                (music) => {

                  const isRecommended =
                    mood &&
                    music.moods.includes(
                      mood
                    );

                  return (

                    <div
                      key={music.id}
                      className={`group rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 ${
                        isRecommended
                          ? "border-purple-400/30 bg-purple-500/10 shadow-lg shadow-purple-950/20"
                          : "border-white/10 bg-white/[0.03] hover:border-blue-400/20 hover:bg-white/[0.06]"
                      }`}
                    >

                      <div className="flex items-start justify-between">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/15 to-purple-500/20 text-3xl">
                          {music.emoji}
                        </div>

                        <div className="flex flex-col items-end gap-2">

                          {isRecommended && (

                            <span className="rounded-full bg-purple-400/10 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-purple-300">
                              Recommended
                            </span>

                          )}

                          <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-medium text-zinc-500">
                            {music.language}
                          </span>

                        </div>

                      </div>

                      <h4 className="mt-5 text-lg font-bold text-white">
                        {music.title}
                      </h4>

                      <p className="mt-1 text-xs font-bold text-purple-300">
                        {music.category}
                      </p>

                      <p className="mt-3 min-h-[48px] text-sm leading-6 text-zinc-500">
                        {music.description}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          handleSpotify(
                            music.search
                          )
                        }
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#11131a] transition hover:bg-gradient-to-r hover:from-cyan-400 hover:via-blue-500 hover:to-purple-600 hover:text-white"
                      >

                        <Music2
                          size={16}
                        />

                        Listen on Spotify

                        <ExternalLink
                          size={13}
                        />

                      </button>

                    </div>

                  );
                }
              )}

            </div>

          ) : (

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">

              <div className="text-4xl">
                🎧
              </div>

              <p className="mt-3 font-semibold text-white">
                No music found
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Try changing your filters.
              </p>

            </div>

          )}

          {/* FOOTER */}

          <div className="mt-6 flex items-center gap-2 text-xs text-zinc-600">

            <span className="text-purple-400">
              ●
            </span>

            <span>
              Music recommendations adapt to
              your selected mood.
            </span>

          </div>

        </section>

        {/* =================================================
            PROGRESS
        ================================================= */}

        <section className="mb-8">

          <div className="rounded-3xl border border-white/10 bg-[#0d1324] p-6 shadow-xl shadow-black/20">

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                  Your Progress
                </p>

                <h3 className="mt-1 text-xl font-bold text-white">

                  {latestActivity
                    ? "Latest Wellness Activity"
                    : "Start Your Wellness Journey"}

                </h3>

                {latestActivity ? (

                  <p className="mt-1 flex items-center gap-2 text-sm text-zinc-500">

                    <CheckCircle2
                      size={14}
                      className="text-cyan-400"
                    />

                    {latestActivity.activity ||
                      latestActivity.activityName ||
                      "Wellness Activity"}

                    {" • "}

                    +{latestActivity.points || 0}
                    {" points"}

                  </p>

                ) : (

                  <p className="mt-1 text-sm text-zinc-500">
                    Complete your first activity
                    to start earning wellness points.
                  </p>

                )}

              </div>

              <button
                type="button"
                onClick={() =>
                  handleStartActivity(
                    "breathing"
                  )
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-900/20 transition hover:from-cyan-400 hover:to-purple-500"
              >

                Try an Activity

                <ChevronRight
                  size={16}
                />

              </button>

            </div>

          </div>

        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="mb-8">

          <div className="mb-5">

            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-400/10 px-3 py-1 text-[10px] font-bold tracking-wider text-blue-300">

              ⚡ QUICK ACCESS

            </div>

            <h3 className="text-2xl font-bold text-white">
              Quick Actions
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Continue your wellness journey.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">

            {/* ACTIVITY */}

            <button
              type="button"
              onClick={() =>
                handleStartActivity(
                  "relaxation"
                )
              }
              className="group rounded-3xl border border-white/10 bg-[#0d1324] p-6 text-left shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-blue-400/25"
            >

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl transition group-hover:scale-110">
                🧘
              </div>

              <h4 className="text-lg font-bold text-white">
                Wellness Activity
              </h4>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Try a personalized activity to
                improve your mood.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-cyan-400">
                Start Activity

                <ChevronRight
                  size={15}
                />
              </span>

            </button>

            {/* CHATBOT */}

            <button
              type="button"
              onClick={() =>
                navigate("/chatbot")
              }
              className="group rounded-3xl border border-white/10 bg-[#0d1324] p-6 text-left shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-purple-400/25"
            >

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300 transition group-hover:scale-110">

                <Bot
                  size={24}
                />

              </div>

              <h4 className="text-lg font-bold text-white">
                AI Wellness Mentor
              </h4>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Talk to your AI wellness companion
                whenever you need support.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-purple-400">
                Open Chatbot

                <ChevronRight
                  size={15}
                />

              </span>

            </button>

            {/* FEEDBACK */}

            <button
              type="button"
              onClick={() =>
                navigate("/feedback")
              }
              className="group rounded-3xl border border-white/10 bg-[#0d1324] p-6 text-left shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-400/25"
            >

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 transition group-hover:scale-110">

                <MessageSquare
                  size={23}
                />

              </div>

              <h4 className="text-lg font-bold text-white">
                Give Feedback
              </h4>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Share your experience and help us
                improve Mood Mentor.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-cyan-400">
                Give Feedback

                <ChevronRight
                  size={15}
                />

              </span>

            </button>

            {/* GAMES */}

            <button
              type="button"
              onClick={() =>
                navigate("/games")
              }
              className="group rounded-3xl border border-white/10 bg-[#0d1324] p-6 text-left shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-pink-400/25 hover:shadow-pink-950/20"
            >

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-2xl transition group-hover:scale-110">
                🎮
              </div>

              <h4 className="text-lg font-bold text-white">
                Wellness Games
              </h4>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Play relaxing and focus-based games
                to refresh your mind.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-pink-400">
                Play Games

                <ChevronRight
                  size={15}
                />

              </span>

            </button>

            {/* ANALYTICS */}

            <button
              type="button"
              onClick={() => navigate("/analytics")}
              className="group rounded-3xl border border-white/10 bg-[#0d1324] p-6 text-left shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-violet-400/25 hover:shadow-violet-950/20"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300 transition group-hover:scale-110">
                <BarChart3 size={24} />
              </div>

              <h4 className="text-lg font-bold text-white">
                Wellness Analytics
              </h4>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                View your mood, activities and wellness progress.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-violet-400">
                View Analytics
                <ChevronRight size={15} />
              </span>
            </button>

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

export default Dashboard;