import React, { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  X,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ============================================================
// BOOK DATA
// ============================================================

const BOOKS = [
  {
    id: 1,
    title: "The Happiness Advantage",
    author: "Shawn Achor",
    category: "Positivity",
    duration: "12 min",
    rating: "4.7",
    points: 10,
    description:
      "Learn simple ways positive thinking can improve productivity, motivation, and everyday wellbeing.",
    chapters: [
      {
        title: "The Power of Positive Thinking",
        content: [
          "Positive thinking does not mean ignoring difficult situations. It means choosing a constructive way to respond to them.",
          "Our daily thoughts influence how we approach challenges, communicate with others, and make decisions. When we deliberately notice positive possibilities, we become more capable of seeing opportunities that might otherwise be missed.",
          "A small shift in perspective can change the way an entire day feels. Instead of asking, “Why is this happening to me?”, try asking, “What can I learn from this situation?”",
          "This simple change encourages curiosity rather than frustration. Over time, these small moments of positive thinking can become healthier mental habits."
        ],
      },
      {
        title: "Small Wins Matter",
        content: [
          "Big changes rarely happen all at once. Most meaningful improvements begin with small actions repeated consistently.",
          "Completing a small task, taking a short break, helping a colleague, or spending a few minutes organizing your priorities can create a sense of progress.",
          "Progress matters because it gives us evidence that our actions are making a difference. Even when the final goal feels far away, recognizing small wins can keep motivation alive.",
          "At the end of each day, try identifying three things that went well. They do not need to be major achievements. A productive meeting, a good conversation, or simply completing something you had been postponing all count."
        ],
      },
      {
        title: "Positive Habits at Work",
        content: [
          "Our workplace environment can strongly influence our energy and motivation. Building positive habits can make everyday work more manageable.",
          "Start by creating small moments of recovery during the day. Step away from your screen, stretch, breathe slowly, or take a short walk.",
          "Positive interactions also matter. A genuine thank-you, encouraging message, or supportive conversation can improve the atmosphere for both people involved.",
          "Rather than trying to completely transform your routine, choose one positive habit that feels realistic and practice it consistently."
        ],
      },
      {
        title: "Building Motivation",
        content: [
          "Motivation is not always something that appears before action. Sometimes action creates motivation.",
          "When a task feels overwhelming, divide it into smaller steps. Completing the first step creates momentum and makes the next one easier.",
          "You can also connect routine tasks to a larger purpose. Understanding why something matters can make it easier to stay engaged.",
          "Give yourself permission to make progress imperfectly. Consistent progress is usually more valuable than waiting for perfect conditions."
        ],
      },
      {
        title: "Applying Positivity Every Day",
        content: [
          "Positive thinking becomes most useful when it becomes part of everyday life.",
          "Before beginning your day, identify one thing you are looking forward to. During the day, notice moments that make you feel calm, grateful, or energized.",
          "When something goes wrong, pause before reacting. Take a breath and consider what response would be most helpful.",
          "You do not need to feel positive every moment. The goal is to develop the ability to recognize possibilities even when things are difficult.",
          "Small positive choices, repeated over time, can create meaningful changes in the way we experience work and everyday life."
        ],
      },
    ],
  },

  {
    id: 2,
    title: "The Calm Mind",
    author: "Mood Mentor Wellness",
    category: "Mindfulness",
    duration: "10 min",
    rating: "4.8",
    points: 10,
    description:
      "A practical guide to slowing down, breathing mindfully, and creating moments of calm.",
    chapters: [
      {
        title: "Understanding Calm",
        content: [
          "Calm does not mean having no problems. It means creating enough space to respond to problems thoughtfully.",
          "A few intentional minutes of quiet can help you step away from constant notifications and competing demands.",
          "Begin by noticing your breathing. There is no need to change it immediately. Simply observe the rhythm of each breath."
        ],
      },
      {
        title: "Mindful Breathing",
        content: [
          "Find a comfortable position and allow your shoulders to relax.",
          "Take a slow breath in and gently breathe out. Notice the movement of your body as you breathe.",
          "When your attention wanders, gently bring it back to your breathing. Wandering is normal; returning your attention is the practice."
        ],
      },
      {
        title: "Creating Calm Moments",
        content: [
          "You can create small moments of calm almost anywhere.",
          "Before opening another application or starting another task, pause for a few seconds. Take one slow breath and decide what deserves your attention next.",
          "These small pauses can help create a healthier rhythm throughout the working day."
        ],
      },
    ],
  },

  {
    id: 3,
    title: "Better Days",
    author: "Mood Mentor Wellness",
    category: "Wellbeing",
    duration: "9 min",
    rating: "4.6",
    points: 10,
    description:
      "Simple ideas for building healthier routines and making everyday moments more meaningful.",
    chapters: [
      {
        title: "One Day at a Time",
        content: [
          "A difficult day does not define your entire week. Give yourself permission to begin again.",
          "Focus on the next useful action rather than trying to solve everything immediately.",
          "Small improvements can make tomorrow easier."
        ],
      },
      {
        title: "Healthy Daily Routines",
        content: [
          "Healthy routines provide structure without needing to be complicated.",
          "Consider consistent sleep, movement, hydration, breaks, and meaningful social connection.",
          "Choose routines that are realistic enough to continue even on busy days."
        ],
      },
    ],
  },

  {
    id: 4,
    title: "Stress-Free Work",
    author: "Mood Mentor Wellness",
    category: "Stress",
    duration: "11 min",
    rating: "4.7",
    points: 10,
    description:
      "Practical strategies for handling workplace pressure and protecting your mental energy.",
    chapters: [
      {
        title: "Recognizing Stress",
        content: [
          "Stress can appear as tiredness, difficulty concentrating, irritability, or feeling constantly rushed.",
          "Recognizing these signals early gives you an opportunity to pause and adjust your routine."
        ],
      },
      {
        title: "Managing Pressure",
        content: [
          "When several tasks compete for attention, identify the most important one first.",
          "Break large responsibilities into smaller actions and give yourself realistic time to complete them.",
          "A short pause can often improve concentration more than continuing to work while overwhelmed."
        ],
      },
    ],
  },
];

// ============================================================
// COMPONENT
// ============================================================

export default function Books() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedBook, setSelectedBook] = useState(null);
  const [chapterIndex, setChapterIndex] = useState(0);

  const [completedBooks, setCompletedBooks] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("moodMentorCompletedBooks") || "[]"
      );
    } catch {
      return [];
    }
  });

  // ============================================================
  // CATEGORIES
  // ============================================================

  const categories = [
    "All",
    ...new Set(BOOKS.map((book) => book.category)),
  ];

  // ============================================================
  // FILTER BOOKS
  // ============================================================

  const filteredBooks = BOOKS.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || book.category === category;

    return matchesSearch && matchesCategory;
  });

  // ============================================================
  // OPEN BOOK
  // ============================================================

  const openBook = (book) => {
    setSelectedBook(book);
    setChapterIndex(0);
  };

  // ============================================================
  // CLOSE BOOK
  // ============================================================

  const closeBook = () => {
    setSelectedBook(null);
    setChapterIndex(0);
  };

  // ============================================================
  // MARK COMPLETED
  // ============================================================

  const markCompleted = (book) => {
    if (!completedBooks.includes(book.id)) {
      const updated = [...completedBooks, book.id];

      setCompletedBooks(updated);

      localStorage.setItem(
        "moodMentorCompletedBooks",
        JSON.stringify(updated)
      );
    }
  };

  const isCompleted = selectedBook
    ? completedBooks.includes(selectedBook.id)
    : false;

  // ============================================================
  // CHAPTER NAVIGATION
  // ============================================================

  const nextChapter = () => {
    if (
      selectedBook &&
      chapterIndex < selectedBook.chapters.length - 1
    ) {
      setChapterIndex((prev) => prev + 1);
    }
  };

  const previousChapter = () => {
    if (chapterIndex > 0) {
      setChapterIndex((prev) => prev - 1);
    }
  };

  // ============================================================
  // PROGRESS
  // ============================================================

  const readingProgress = selectedBook
    ? Math.round(
        ((chapterIndex + 1) / selectedBook.chapters.length) * 100
      )
    : 0;

  // ============================================================
  // READER VIEW
  // ============================================================

  if (selectedBook) {
    const chapter = selectedBook.chapters[chapterIndex];

    return (
      <div className="min-h-screen bg-[#09090f] text-white">
        {/* HEADER */}

        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#09090f]/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
            <button
              onClick={closeBook}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft size={20} />
              <span>Back to Library</span>
            </button>

            <div className="hidden text-center sm:block">
              <p className="text-sm font-semibold">
                {selectedBook.title}
              </p>
              <p className="text-xs text-gray-500">
                {selectedBook.author}
              </p>
            </div>

            <button
              onClick={closeBook}
              className="rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* BOOK */}

        <main className="mx-auto max-w-4xl px-5 py-10">
          {/* BOOK HEADER */}

          <div className="mb-10 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 to-violet-700 shadow-lg shadow-purple-900/30">
              <BookOpen size={36} />
            </div>

            <p className="mb-2 text-sm font-medium text-purple-400">
              {selectedBook.category}
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              {selectedBook.title}
            </h1>

            <p className="mt-2 text-gray-400">
              by {selectedBook.author}
            </p>
          </div>

          {/* PROGRESS */}

          <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-gray-400">
                Reading Progress
              </span>

              <span className="font-semibold text-purple-400">
                {readingProgress}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500 transition-all duration-500"
                style={{ width: `${readingProgress}%` }}
              />
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Chapter {chapterIndex + 1} of{" "}
              {selectedBook.chapters.length}
            </p>
          </div>

          {/* CHAPTER */}

          <article className="rounded-3xl border border-white/10 bg-[#11111a] p-7 shadow-2xl sm:p-12">
            <div className="mb-8">
              <p className="mb-3 text-sm font-medium text-purple-400">
                Chapter {chapterIndex + 1}
              </p>

              <h2 className="text-2xl font-bold sm:text-3xl">
                {chapter.title}
              </h2>
            </div>

            <div className="space-y-6">
              {chapter.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-[17px] leading-8 text-gray-300"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* REFLECTION */}

            {chapterIndex === selectedBook.chapters.length - 1 && (
              <div className="mt-10 rounded-2xl border border-purple-500/20 bg-purple-500/10 p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles
                    size={20}
                    className="text-purple-400"
                  />

                  <h3 className="font-semibold">
                    Reflection
                  </h3>
                </div>

                <p className="text-sm leading-6 text-gray-300">
                  What is one small idea from this book that you
                  could apply to your everyday routine?
                </p>
              </div>
            )}
          </article>

          {/* NAVIGATION */}

          <div className="mt-7 flex items-center justify-between gap-4">
            <button
              onClick={previousChapter}
              disabled={chapterIndex === 0}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            {chapterIndex < selectedBook.chapters.length - 1 ? (
              <button
                onClick={nextChapter}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-purple-900/20 transition hover:scale-[1.02]"
              >
                Next Chapter
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={() => markCompleted(selectedBook)}
                disabled={isCompleted}
                className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  isCompleted
                    ? "cursor-default bg-green-500/15 text-green-400"
                    : "bg-gradient-to-r from-purple-600 to-violet-600 hover:scale-[1.02]"
                }`}
              >
                <CheckCircle size={18} />

                {isCompleted
                  ? "Completed +10 points"
                  : "Mark as Completed (+10 points)"}
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ============================================================
  // LIBRARY VIEW
  // ============================================================

  return (
    <div className="min-h-screen bg-[#09090f] text-white">
      {/* HEADER */}

      <header className="border-b border-white/10 bg-[#09090f]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={20} />
            <span>Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <BookOpen className="text-purple-400" size={22} />

            <span className="font-bold">
              Wellness Library
            </span>
          </div>

          <div className="w-24" />
        </div>
      </header>

      {/* HERO */}

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-violet-900/20" />

        <div className="relative mx-auto max-w-7xl px-5 py-14">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
              <Sparkles size={16} />
              Wellness Reading
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Read. Reflect.
              <span className="block bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                Feel Better.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-gray-400 leading-7">
              Explore short, practical wellness books designed
              to help you build positive habits, manage stress,
              and create healthier everyday routines.
            </p>
          </div>
        </div>
      </section>

      {/* SEARCH + FILTER */}

      <section className="mx-auto max-w-7xl px-5 pb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* SEARCH */}

          <div className="relative max-w-md flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500/50 focus:bg-white/[0.06]"
            />
          </div>

          {/* CATEGORIES */}

          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  category === item
                    ? "bg-purple-600 text-white"
                    : "border border-white/10 bg-white/[0.03] text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BOOK GRID */}

      <main className="mx-auto max-w-7xl px-5 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Wellness Books
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredBooks.length} books available
            </p>
          </div>

          <div className="text-sm text-gray-500">
            {completedBooks.length} completed
          </div>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-20 text-center">
            <BookOpen
              size={42}
              className="mx-auto mb-4 text-gray-600"
            />

            <h3 className="text-lg font-semibold">
              No books found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => {
              const completed = completedBooks.includes(book.id);

              return (
                <div
                  key={book.id}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-[#11111a] transition duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-950/20"
                >
                  {/* COVER */}

                  <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-[#25133e] to-[#100b1d]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.3),transparent_40%)]" />

                    <div className="relative text-center px-6">
                      <BookOpen
                        size={38}
                        className="mx-auto mb-4 text-purple-300"
                      />

                      <h3 className="text-xl font-bold leading-tight">
                        {book.title}
                      </h3>

                      <p className="mt-2 text-sm text-purple-200/70">
                        {book.author}
                      </p>
                    </div>

                    {completed && (
                      <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-green-500/15 px-3 py-1.5 text-xs font-semibold text-green-400">
                        <CheckCircle size={14} />
                        Completed
                      </div>
                    )}
                  </div>

                  {/* INFO */}

                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">
                        {book.category}
                      </span>

                      <span className="text-sm text-gray-500">
                        ★ {book.rating}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold">
                      {book.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      by {book.author}
                    </p>

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-400">
                      {book.description}
                    </p>

                    {/* META */}

                    <div className="mt-5 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {book.duration}
                      </span>

                      <span className="text-purple-400">
                        +{book.points} points
                      </span>
                    </div>

                    {/* BUTTON */}

                    <button
                      onClick={() => openBook(book)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 py-3 text-sm font-semibold transition hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-900/30"
                    >
                      <BookOpen size={17} />

                      {completed
                        ? "Read Again"
                        : "Start Reading"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}