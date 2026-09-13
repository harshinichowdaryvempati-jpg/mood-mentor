import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  Clock3,
  Gamepad2,
  RotateCcw,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

/* =========================================================
   STORAGE
========================================================= */

const COMPLETED_GAMES_KEY = "moodMentorCompletedGames";

const getCompletedGames = () => {
  try {
    const saved = localStorage.getItem(
      COMPLETED_GAMES_KEY
    );

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/* =========================================================
   GAME LIST
========================================================= */

const GAMES = [
  {
    id: "memory",
    title: "Memory Match",
    emoji: "🧠",
    description:
      "Match all the wellness symbols and challenge your memory.",
  },
  {
    id: "sudoku",
    title: "Sudoku",
    emoji: "🔢",
    description:
      "Solve the number puzzle using logic and concentration.",
  },
  {
    id: "number",
    title: "Number Rush",
    emoji: "🎯",
    description:
      "Find the numbers in the correct order before time runs out.",
  },
  {
    id: "quiz",
    title: "Mindful Quiz",
    emoji: "🧩",
    description:
      "Test your knowledge of healthy wellness habits.",
  },
];

/* =========================================================
   HELPERS
========================================================= */

const shuffle = (array) => {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [
      result[j],
      result[i],
    ];
  }

  return result;
};

const saveCompletedGame = (
  gameId,
  score,
  setCompletedGames
) => {
  const current = getCompletedGames();

  const exists = current.some(
    (game) => game.id === gameId
  );

  if (exists) {
    setCompletedGames(current);
    return;
  }

  const updated = [
    ...current,
    {
      id: gameId,
      score,
      points: 10,
      completedAt:
        new Date().toISOString(),
    },
  ];

  localStorage.setItem(
    COMPLETED_GAMES_KEY,
    JSON.stringify(updated)
  );

  setCompletedGames(updated);
};

/* =========================================================
   MAIN
========================================================= */

export default function GamesSession() {
  const navigate = useNavigate();

  const [selectedGame, setSelectedGame] =
    useState(null);

  const [completedGames, setCompletedGames] =
    useState(getCompletedGames);

  const totalPoints = completedGames.reduce(
    (sum, game) =>
      sum + (game.points || 0),
    0
  );

  const handleComplete = (
    gameId,
    score
  ) => {
    saveCompletedGame(
      gameId,
      score,
      setCompletedGames
    );
  };

  if (!selectedGame) {
    return (
      <GamesLibrary
        navigate={navigate}
        completedGames={completedGames}
        totalPoints={totalPoints}
        onSelect={setSelectedGame}
      />
    );
  }

  return (
    <GameShell
      title={
        GAMES.find(
          (game) =>
            game.id === selectedGame
        )?.title
      }
      onBack={() =>
        setSelectedGame(null)
      }
    >
      {selectedGame === "memory" && (
        <MemoryMatch
          onComplete={(score) =>
            handleComplete(
              "memory",
              score
            )
          }
        />
      )}

      {selectedGame === "sudoku" && (
        <Sudoku
          onComplete={(score) =>
            handleComplete(
              "sudoku",
              score
            )
          }
        />
      )}

      {selectedGame === "number" && (
        <NumberRush
          onComplete={(score) =>
            handleComplete(
              "number",
              score
            )
          }
        />
      )}

      {selectedGame === "quiz" && (
        <MindfulQuiz
          onComplete={(score) =>
            handleComplete(
              "quiz",
              score
            )
          }
        />
      )}
    </GameShell>
  );
}

/* =========================================================
   GAMES LIBRARY
========================================================= */

function GamesLibrary({
  navigate,
  completedGames,
  totalPoints,
  onSelect,
}) {
  return (
    <div className="min-h-screen bg-[#080b14] text-white">

      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-pink-600/10 blur-3xl" />

      </div>

      {/* NAVBAR */}

      <nav className="relative z-10 border-b border-white/10 bg-[#080b14]/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">
              <Brain size={23} />
            </div>

            <div className="text-left">

              <h1 className="font-bold">
                Mood Mentor
              </h1>

              <p className="text-xs text-zinc-500">
                Wellness Games
              </p>

            </div>

          </button>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >

            <ArrowLeft size={16} />

            Dashboard

          </button>

        </div>

      </nav>

      {/* CONTENT */}

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* HERO */}

        <section className="relative mb-7 overflow-hidden rounded-3xl border border-purple-400/20 bg-gradient-to-br from-[#17133b] via-[#121633] to-[#101c38] p-6 shadow-2xl shadow-purple-950/20 sm:p-8">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />

          <div className="relative">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-300">

              <Gamepad2 size={13} />

              WELLNESS GAMES

            </div>

            <h2 className="text-3xl font-bold sm:text-4xl">

              Refresh your mind.{" "}

              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Have some fun.
              </span>

            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Take a short mental break with games
              designed to improve memory, logic,
              attention and mindful thinking.
            </p>

          </div>

        </section>

        {/* STATS */}

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <StatCard
            icon={<Gamepad2 size={22} />}
            value="4"
            label="Games Available"
          />

          <StatCard
            icon={<Trophy size={22} />}
            value={completedGames.length}
            label="Games Completed"
          />

          <StatCard
            icon={<Sparkles size={22} />}
            value={totalPoints}
            label="Wellness Points"
          />

        </section>

        {/* GAME CARDS */}

        <section>

          <h3 className="text-2xl font-bold">
            Choose a Game
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            Select a game and enjoy a quick mental
            break.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

            {GAMES.map((game) => {

              const completed =
                completedGames.some(
                  (item) =>
                    item.id === game.id
                );

              return (
                <button
                  key={game.id}
                  onClick={() =>
                    onSelect(game.id)
                  }
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1324] p-6 text-left shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-purple-400/30 hover:shadow-purple-950/20"
                >

                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl transition group-hover:bg-purple-500/20" />

                  <div className="relative">

                    <div className="flex items-start justify-between">

                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/15 text-4xl transition group-hover:scale-110">
                        {game.emoji}
                      </div>

                      {completed && (
                        <span className="flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold text-emerald-300">

                          <CheckCircle2 size={12} />

                          Completed

                        </span>
                      )}

                    </div>

                    <h4 className="mt-6 text-xl font-bold">
                      {game.title}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      {game.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between">

                      <span className="rounded-full border border-purple-400/15 bg-purple-400/10 px-3 py-1.5 text-xs font-bold text-purple-300">
                        +10 points
                      </span>

                      <span className="flex items-center gap-1 text-sm font-bold text-cyan-400">
                        Play →
                      </span>

                    </div>

                  </div>

                </button>
              );
            })}

          </div>

        </section>

        {/* TIP */}

        <div className="mt-8 rounded-3xl border border-white/10 bg-[#0d1324] p-5">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-xl">
              💜
            </div>

            <div>

              <h4 className="font-bold">
                Wellness Tip
              </h4>

              <p className="mt-1 text-sm leading-6 text-zinc-500">
                A short game can be a refreshing mental
                break between tasks.
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  value,
  label,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d1324] p-5 shadow-xl shadow-black/20">

      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
        {icon}
      </div>

      <p className="text-3xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-sm text-zinc-500">
        {label}
      </p>

    </div>
  );
}

/* =========================================================
   GAME SHELL
========================================================= */

function GameShell({
  title,
  onBack,
  children,
}) {
  return (
    <div className="min-h-screen bg-[#080b14] text-white">

      <nav className="border-b border-white/10 bg-[#080b14]/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">

          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >

            <ArrowLeft size={16} />

            Back to Games

          </button>

          <div className="flex items-center gap-2">

            <Gamepad2
              size={18}
              className="text-purple-400"
            />

            <span className="font-bold">
              {title}
            </span>

          </div>

        </div>

      </nav>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {children}
      </main>

    </div>
  );
}

/* =========================================================
   GAME HEADER
========================================================= */

function GameHeader({
  emoji,
  title,
  description,
}) {
  return (
    <div className="mb-7">

      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/15 to-blue-500/15 text-4xl">
        {emoji}
      </div>

      <h2 className="text-3xl font-bold">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  icon,
  value,
  label,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1324] p-4">

      <div className="flex items-center gap-2 text-purple-300">
        {icon}

        <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
          {label}
        </span>
      </div>

      <p className="mt-2 text-xl font-bold">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   RESULT SCREEN
========================================================= */

function ResultScreen({
  emoji,
  title,
  description,
  score,
  onAgain,
}) {
  return (
    <div className="mx-auto max-w-2xl">

      <div className="rounded-3xl border border-purple-400/20 bg-gradient-to-br from-[#17133b] via-[#111827] to-[#0e2140] p-8 text-center shadow-2xl shadow-purple-950/20 sm:p-12">

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-purple-500/10 text-6xl">
          {emoji}
        </div>

        <h2 className="mt-7 text-3xl font-bold">
          {title}
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-zinc-400">
          {description}
        </p>

        <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-3">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

            <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Score
            </p>

            <p className="mt-2 text-3xl font-bold">
              {score}
            </p>

          </div>

          <div className="rounded-2xl border border-purple-400/20 bg-purple-400/10 p-5">

            <p className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Wellness Points
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-200">
              +10
            </p>

          </div>

        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-400">

          <CheckCircle2 size={17} />

          Game completed!

        </div>

        <button
          onClick={onAgain}
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-7 py-3 font-bold shadow-lg transition hover:-translate-y-0.5"
        >

          <RotateCcw size={17} />

          Play Again

        </button>

      </div>

    </div>
  );
}

/* =========================================================
   1. MEMORY MATCH
========================================================= */

function MemoryMatch({
  onComplete,
}) {

  const symbols = [
    "🌿",
    "🧘",
    "💜",
    "🌙",
    "☀️",
    "🌸",
    "🧠",
    "✨",
  ];

  const createCards = () =>
    shuffle(
      symbols.flatMap(
        (symbol, index) => [
          {
            id: `${index}-1-${Math.random()}`,
            symbol,
            matched: false,
          },
          {
            id: `${index}-2-${Math.random()}`,
            symbol,
            matched: false,
          },
        ]
      )
    );

  const [cards, setCards] =
    useState(createCards);

  const [flipped, setFlipped] =
    useState([]);

  const [moves, setMoves] =
    useState(0);

  const [matches, setMatches] =
    useState(0);

  const [time, setTime] =
    useState(90);

  const [started, setStarted] =
    useState(false);

  const [finished, setFinished] =
    useState(false);

  useEffect(() => {

    if (
      !started ||
      finished ||
      time <= 0
    ) {
      return;
    }

    const interval =
      setInterval(() => {
        setTime(
          (previous) =>
            previous - 1
        );
      }, 1000);

    return () =>
      clearInterval(interval);

  }, [
    started,
    finished,
    time,
  ]);

  useEffect(() => {

    if (
      time === 0 &&
      started &&
      !finished
    ) {
      setFinished(true);
    }

  }, [
    time,
    started,
    finished,
  ]);

  useEffect(() => {

    if (
      matches === symbols.length &&
      started &&
      !finished
    ) {

      const score = Math.max(
        50,
        100 -
          moves * 2 +
          time
      );

      setFinished(true);

      onComplete(score);
    }

  }, [
    matches,
    started,
    finished,
    moves,
    time,
    onComplete,
    symbols.length,
  ]);

  const clickCard = (index) => {

    if (
      flipped.length === 2 ||
      cards[index].matched ||
      flipped.includes(index) ||
      finished
    ) {
      return;
    }

    setStarted(true);

    const next = [
      ...flipped,
      index,
    ];

    setFlipped(next);

    if (next.length === 2) {

      setMoves(
        (previous) =>
          previous + 1
      );

      const first = cards[next[0]];
      const second = cards[next[1]];

      if (
        first.symbol ===
        second.symbol
      ) {

        setTimeout(() => {

          setCards((previous) =>
            previous.map(
              (card, i) =>
                i === next[0] ||
                i === next[1]
                  ? {
                      ...card,
                      matched: true,
                    }
                  : card
            )
          );

          setMatches(
            (previous) =>
              previous + 1
          );

          setFlipped([]);

        }, 400);

      } else {

        setTimeout(() => {
          setFlipped([]);
        }, 700);

      }
    }
  };

  const reset = () => {

    setCards(createCards());
    setFlipped([]);
    setMoves(0);
    setMatches(0);
    setTime(90);
    setStarted(false);
    setFinished(false);

  };

  if (finished) {

    const won =
      matches === symbols.length;

    return (
      <ResultScreen
        emoji={won ? "🏆" : "⏰"}
        title={
          won
            ? "Memory Master!"
            : "Time's Up!"
        }
        description={
          won
            ? `You matched all pairs in ${moves} moves.`
            : "Try again and see if you can match every pair."
        }
        score={
          won
            ? Math.max(
                50,
                100 -
                  moves * 2 +
                  time
              )
            : 0
        }
        onAgain={reset}
      />
    );
  }

  return (
    <div>

      <GameHeader
        emoji="🧠"
        title="Memory Match"
        description="Find all matching pairs before time runs out."
      />

      <div className="mb-6 grid grid-cols-3 gap-3">

        <MiniStat
          icon={<Clock3 size={16} />}
          value={`${time}s`}
          label="Time"
        />

        <MiniStat
          icon={<Zap size={16} />}
          value={moves}
          label="Moves"
        />

        <MiniStat
          icon={<Trophy size={16} />}
          value={`${matches}/8`}
          label="Matches"
        />

      </div>

      <div className="mx-auto grid max-w-xl grid-cols-4 gap-3">

        {cards.map((card, index) => {

          const visible =
            flipped.includes(index) ||
            card.matched;

          return (
            <button
              key={card.id}
              onClick={() =>
                clickCard(index)
              }
              className={`aspect-square rounded-2xl border text-3xl transition sm:text-4xl ${
                visible
                  ? "border-purple-400/40 bg-purple-500/20"
                  : "border-white/10 bg-[#111827] hover:border-purple-400/30 hover:bg-purple-500/10"
              }`}
            >
              {visible
                ? card.symbol
                : "✦"}
            </button>
          );
        })}

      </div>

    </div>
  );
}

/* =========================================================
   2. SUDOKU
========================================================= */

const SUDOKU_PUZZLE = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],

  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],

  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

const SUDOKU_SOLUTION = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

function Sudoku({
  onComplete,
}) {

  const [board, setBoard] =
    useState(() =>
      SUDOKU_PUZZLE.map(
        (row) => [...row]
      )
    );

  const [selected, setSelected] =
    useState(null);

  const [mistakes, setMistakes] =
    useState(0);

  const [time, setTime] =
    useState(0);

  const [finished, setFinished] =
    useState(false);

  useEffect(() => {

    if (finished) return;

    const interval =
      setInterval(() => {
        setTime(
          (previous) =>
            previous + 1
        );
      }, 1000);

    return () =>
      clearInterval(interval);

  }, [finished]);

  const isFixed = (row, col) =>
    SUDOKU_PUZZLE[row][col] !== 0;

  const enterNumber = (number) => {

    if (!selected || finished) {
      return;
    }

    const [row, col] = selected;

    if (isFixed(row, col)) {
      return;
    }

    if (
      number !==
      SUDOKU_SOLUTION[row][col]
    ) {

      setMistakes(
        (previous) =>
          previous + 1
      );

      return;
    }

    const updated =
      board.map((r) => [...r]);

    updated[row][col] = number;

    setBoard(updated);

    const solved =
      updated.every(
        (r, rIndex) =>
          r.every(
            (value, cIndex) =>
              value ===
              SUDOKU_SOLUTION[
                rIndex
              ][cIndex]
          )
      );

    if (solved) {

      setFinished(true);

      const score = Math.max(
        50,
        100 -
          mistakes * 5 -
          Math.floor(time / 10)
      );

      onComplete(score);

    }

  };

  const reset = () => {

    setBoard(
      SUDOKU_PUZZLE.map(
        (row) => [...row]
      )
    );

    setSelected(null);
    setMistakes(0);
    setTime(0);
    setFinished(false);

  };

  if (finished) {

    return (
      <ResultScreen
        emoji="🏆"
        title="Sudoku Solved!"
        description={`Excellent! You solved the puzzle in ${time} seconds with ${mistakes} mistake${mistakes === 1 ? "" : "s"}.`}
        score={Math.max(
          50,
          100 -
            mistakes * 5 -
            Math.floor(time / 10)
        )}
        onAgain={reset}
      />
    );
  }

  return (
    <div>

      <GameHeader
        emoji="🔢"
        title="Sudoku"
        description="Fill every empty cell with the correct number from 1 to 9."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">

        <MiniStat
          icon={<Clock3 size={16} />}
          value={`${time}s`}
          label="Time"
        />

        <MiniStat
          icon={<Zap size={16} />}
          value={mistakes}
          label="Mistakes"
        />

        <div className="hidden sm:block">
          <MiniStat
            icon={<Trophy size={16} />}
            value="9×9"
            label="Puzzle"
          />
        </div>

      </div>

      {/* BOARD */}

      <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl border-2 border-purple-400/30 bg-[#111827]">

        <div className="grid grid-cols-9">

          {board.map(
            (row, rowIndex) =>
              row.map(
                (value, colIndex) => {

                  const fixed =
                    isFixed(
                      rowIndex,
                      colIndex
                    );

                  const selectedCell =
                    selected &&
                    selected[0] ===
                      rowIndex &&
                    selected[1] ===
                      colIndex;

                  const sameRow =
                    selected &&
                    selected[0] ===
                      rowIndex;

                  const sameCol =
                    selected &&
                    selected[1] ===
                      colIndex;

                  const sameBox =
                    selected &&
                    Math.floor(
                      selected[0] / 3
                    ) ===
                      Math.floor(
                        rowIndex / 3
                      ) &&
                    Math.floor(
                      selected[1] / 3
                    ) ===
                      Math.floor(
                        colIndex / 3
                      );

                  const borderRight =
                    colIndex === 2 ||
                    colIndex === 5;

                  const borderBottom =
                    rowIndex === 2 ||
                    rowIndex === 5;

                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() =>
                        setSelected([
                          rowIndex,
                          colIndex,
                        ])
                      }
                      className={`flex aspect-square items-center justify-center border border-white/10 text-sm font-bold transition sm:text-lg ${
                        borderRight
                          ? "border-r-2 border-r-purple-400/40"
                          : ""
                      } ${
                        borderBottom
                          ? "border-b-2 border-b-purple-400/40"
                          : ""
                      } ${
                        selectedCell
                          ? "bg-purple-500/30 text-white"
                          : sameRow ||
                            sameCol ||
                            sameBox
                          ? "bg-purple-500/10"
                          : "bg-transparent"
                      } ${
                        fixed
                          ? "text-purple-200"
                          : "text-cyan-300 hover:bg-white/5"
                      }`}
                    >
                      {value || ""}
                    </button>
                  );
                }
              )
          )}

        </div>

      </div>

      {/* NUMBER PAD */}

      <div className="mx-auto mt-5 grid max-w-lg grid-cols-9 gap-2">

        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
          (number) => (
            <button
              key={number}
              onClick={() =>
                enterNumber(number)
              }
              className="aspect-square rounded-xl border border-white/10 bg-[#0d1324] font-bold text-cyan-300 transition hover:border-purple-400/30 hover:bg-purple-500/10"
            >
              {number}
            </button>
          )
        )}

      </div>

      <p className="mt-5 text-center text-xs text-zinc-600">
        Select an empty cell and choose a number.
        Incorrect numbers count as mistakes.
      </p>

    </div>
  );
}

/* =========================================================
   3. NUMBER RUSH
========================================================= */

function NumberRush({
  onComplete,
}) {

  const TOTAL = 20;

  const createNumbers = () =>
    shuffle(
      Array.from(
        { length: TOTAL },
        (_, index) =>
          index + 1
      )
    );

  const [numbers, setNumbers] =
    useState(createNumbers);

  const [nextNumber, setNextNumber] =
    useState(1);

  const [time, setTime] =
    useState(30);

  const [started, setStarted] =
    useState(false);

  const [finished, setFinished] =
    useState(false);

  const [wrongClicks, setWrongClicks] =
    useState(0);

  useEffect(() => {

    if (
      !started ||
      finished ||
      time <= 0
    ) {
      return;
    }

    const interval =
      setInterval(() => {

        setTime(
          (previous) =>
            previous - 1
        );

      }, 1000);

    return () =>
      clearInterval(interval);

  }, [
    started,
    finished,
    time,
  ]);

  useEffect(() => {

    if (
      started &&
      time === 0 &&
      !finished
    ) {
      setFinished(true);
    }

  }, [
    started,
    time,
    finished,
  ]);

  const start = () => {

    setNumbers(
      createNumbers()
    );

    setNextNumber(1);
    setTime(30);
    setWrongClicks(0);
    setStarted(true);
    setFinished(false);

  };

  const clickNumber = (number) => {

    if (!started || finished) {
      return;
    }

    if (number === nextNumber) {

      const next =
        nextNumber + 1;

      setNextNumber(next);

      if (next > TOTAL) {

        const score =
          time * 5 -
          wrongClicks * 2 +
          50;

        setFinished(true);

        onComplete(
          Math.max(50, score)
        );
      }

    } else {

      setWrongClicks(
        (previous) =>
          previous + 1
      );

    }

  };

  if (finished) {

    const won =
      nextNumber > TOTAL;

    return (
      <ResultScreen
        emoji={won ? "🎯" : "⏰"}
        title={
          won
            ? "Number Rush Complete!"
            : "Time's Up!"
        }
        description={
          won
            ? `Amazing! You found all ${TOTAL} numbers with ${wrongClicks} wrong clicks.`
            : `You reached number ${Math.max(
                1,
                nextNumber - 1
              )}. Try again and beat your time.`
        }
        score={
          won
            ? Math.max(
                50,
                time * 5 -
                  wrongClicks * 2 +
                  50
              )
            : 0
        }
        onAgain={start}
      />
    );
  }

  return (
    <div>

      <GameHeader
        emoji="🎯"
        title="Number Rush"
        description="Click 1, then 2, then 3 and continue until you reach 20."
      />

      <div className="mb-6 grid grid-cols-3 gap-3">

        <MiniStat
          icon={<Clock3 size={16} />}
          value={`${time}s`}
          label="Time"
        />

        <MiniStat
          icon={<Zap size={16} />}
          value={nextNumber}
          label="Next"
        />

        <MiniStat
          icon={<Trophy size={16} />}
          value={wrongClicks}
          label="Mistakes"
        />

      </div>

      {!started ? (

        <div className="rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-cyan-500/10 via-[#111827] to-purple-500/10 p-10 text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-400/10 text-5xl">
            🎯
          </div>

          <h3 className="mt-6 text-2xl font-bold">
            Ready for the rush?
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
            Find the numbers in order as quickly
            as possible.
          </p>

          <button
            onClick={start}
            className="mt-7 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-7 py-3 font-bold shadow-lg"
          >
            Start Number Rush
          </button>

        </div>

      ) : (

        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-[#0d1324] p-5">

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">

            {numbers.map(
              (number) => {

                const completed =
                  number <
                  nextNumber;

                return (
                  <button
                    key={number}
                    onClick={() =>
                      clickNumber(
                        number
                      )
                    }
                    disabled={completed}
                    className={`aspect-square rounded-2xl border text-lg font-bold transition sm:text-xl ${
                      completed
                        ? "border-emerald-400/10 bg-emerald-400/5 text-emerald-500/30"
                        : "border-white/10 bg-[#111827] text-white hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-cyan-400/10"
                    }`}
                  >
                    {number}
                  </button>
                );
              }
            )}

          </div>

        </div>

      )}

    </div>
  );
}

/* =========================================================
   4. MINDFUL QUIZ
========================================================= */

const QUIZ = [
  {
    question:
      "Which habit can help improve concentration during work?",
    options: [
      "Taking short planned breaks",
      "Skipping every break",
      "Doing several tasks at once",
      "Working continuously without rest",
    ],
    answer: 0,
  },
  {
    question:
      "What does mindfulness mainly encourage?",
    options: [
      "Ignoring your surroundings",
      "Focusing on the present moment",
      "Avoiding all thoughts",
      "Working without breaks",
    ],
    answer: 1,
  },
  {
    question:
      "Which activity can be useful during a stressful workday?",
    options: [
      "A short walk",
      "Skipping lunch",
      "Ignoring stress",
      "Working longer without a pause",
    ],
    answer: 0,
  },
  {
    question:
      "Which habit can support healthy sleep?",
    options: [
      "A consistent wind-down routine",
      "Using screens all night",
      "Drinking caffeine immediately before bed",
      "Skipping sleep regularly",
    ],
    answer: 0,
  },
  {
    question:
      "What is one benefit of taking regular breaks?",
    options: [
      "They can refresh attention",
      "They remove the need for sleep",
      "They guarantee zero stress",
      "They make tasks disappear",
    ],
    answer: 0,
  },
];

function MindfulQuiz({
  onComplete,
}) {

  const questions = useMemo(
    () => shuffle(QUIZ),
    []
  );

  const [current, setCurrent] =
    useState(0);

  const [score, setScore] =
    useState(0);

  const [selected, setSelected] =
    useState(null);

  const [finished, setFinished] =
    useState(false);

  const question =
    questions[current];

  const answer = (index) => {

    if (selected !== null) {
      return;
    }

    setSelected(index);

    const correct =
      index === question.answer;

    const newScore =
      score + (correct ? 1 : 0);

    if (correct) {
      setScore(newScore);
    }

    setTimeout(() => {

      if (
        current ===
        questions.length - 1
      ) {

        setFinished(true);

        onComplete(
          newScore * 20
        );

      } else {

        setCurrent(
          (previous) =>
            previous + 1
        );

        setSelected(null);

      }

    }, 800);

  };

  const reset = () => {
    window.location.reload();
  };

  if (finished) {

    return (
      <ResultScreen
        emoji={
          score >= 4
            ? "🏆"
            : "🌟"
        }
        title={
          score >= 4
            ? "Mindful Master!"
            : "Nice Work!"
        }
        description={`You answered ${score} out of ${questions.length} questions correctly.`}
        score={score * 20}
        onAgain={reset}
      />
    );
  }

  return (
    <div>

      <GameHeader
        emoji="🧩"
        title="Mindful Quiz"
        description="Test your knowledge of healthy and mindful workplace habits."
      />

      {/* PROGRESS */}

      <div className="mb-6">

        <div className="mb-2 flex justify-between text-xs font-semibold text-zinc-500">

          <span>
            Question {current + 1} of{" "}
            {questions.length}
          </span>

          <span>
            Score: {score}
          </span>

        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/5">

          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 transition-all"
            style={{
              width: `${
                ((current + 1) /
                  questions.length) *
                100
              }%`,
            }}
          />

        </div>

      </div>

      {/* QUESTION */}

      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-[#0d1324] p-6 shadow-xl sm:p-8">

        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-3xl">
          🧠
        </div>

        <h3 className="text-xl font-bold leading-8 sm:text-2xl">
          {question.question}
        </h3>

        <div className="mt-7 space-y-3">

          {question.options.map(
            (option, index) => {

              const isSelected =
                selected === index;

              const isCorrect =
                index ===
                question.answer;

              let style =
                "border-white/10 bg-white/[0.03] hover:border-purple-400/30 hover:bg-purple-500/10";

              if (
                selected !== null
              ) {

                if (isCorrect) {

                  style =
                    "border-emerald-400/40 bg-emerald-400/10";

                } else if (
                  isSelected
                ) {

                  style =
                    "border-red-400/40 bg-red-400/10";

                } else {

                  style =
                    "border-white/5 bg-white/[0.02] opacity-50";

                }

              }

              return (
                <button
                  key={option}
                  disabled={
                    selected !== null
                  }
                  onClick={() =>
                    answer(index)
                  }
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left text-sm font-medium text-zinc-300 transition ${style}`}
                >

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xs font-bold text-zinc-500">
                    {String.fromCharCode(
                      65 + index
                    )}
                  </span>

                  <span>
                    {option}
                  </span>

                  {selected !== null &&
                    isCorrect && (
                      <CheckCircle2
                        size={18}
                        className="ml-auto text-emerald-400"
                      />
                    )}

                </button>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
}