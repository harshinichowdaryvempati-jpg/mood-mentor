import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  Bot,
  Brain,
  Heart,
  Loader2,
  Moon,
  Send,
  Sparkles,
  Trash2,
  User,
  Wind,
} from "lucide-react";

import { useNavigate } from "react-router-dom";


const API_URL =
  "http://127.0.0.1:5000";


const CHAT_STORAGE_KEY =
  "moodMentorChatHistory";


const QUICK_PROMPTS = [

  {
    icon: Heart,
    text: "I'm feeling stressed today.",
  },

  {
    icon: Wind,
    text: "Give me a quick breathing exercise.",
  },

  {
    icon: Brain,
    text: "How can I improve my focus?",
  },

  {
    icon: Moon,
    text: "How can I relax after work?",
  },

];


function safeParse(
  value,
  fallback = null
) {

  try {

    return value
      ? JSON.parse(value)
      : fallback;

  } catch {

    return fallback;

  }

}


function getEmployee() {

  return (

    safeParse(
      localStorage.getItem(
        "moodMentorEmployee"
      )
    )

    ||

    safeParse(
      localStorage.getItem(
        "currentUser"
      )
    )

    ||

    safeParse(
      localStorage.getItem(
        "user"
      )
    )

    ||

    {}

  );

}


function getEmployeeId(
  employee
) {

  return (

    employee.employeeId

    ||

    employee.employee_id

    ||

    localStorage.getItem(
      "moodMentorEmployeeId"
    )

    ||

    ""

  );

}


function getEmployeeName(
  employee
) {

  return (

    employee.fullName

    ||

    employee.full_name

    ||

    employee.name

    ||

    employee.username

    ||

    employee.email?.split(
      "@"
    )[0]

    ||

    "Employee"

  );

}


function getLatestMood() {

  const savedMood =
    localStorage.getItem(
      "moodMentorMood"
    );


  if (!savedMood) {

    return {

      mood:
        "Not available",

      score:
        "Not available",

    };

  }


  const parsed =
    safeParse(
      savedMood,
      null
    );


  if (
    parsed &&
    typeof parsed === "object"
  ) {

    return {

      mood:
        parsed.mood
        ||
        parsed.name
        ||
        "Not available",

      score:
        parsed.score
        ??
        parsed.moodScore
        ??
        "Not available",

    };

  }


  return {

    mood:
      savedMood,

    score:
      "Not available",

  };

}


function getCompletedActivities() {

  const saved =
    safeParse(

      localStorage.getItem(
        "moodMentorCompletedActivities"
      ),

      []

    );


  if (
    !Array.isArray(saved)
  ) {

    return [];

  }


  return saved;

}


export default function Chatbot() {

  const navigate =
    useNavigate();


  // ==========================================================
  // CHAT STATE
  // ==========================================================

  const [
    messages,
    setMessages
  ] = useState(() => {

    const saved =
      safeParse(

        localStorage.getItem(
          CHAT_STORAGE_KEY
        ),

        []

      );


    if (
      Array.isArray(saved)
      &&
      saved.length > 0
    ) {

      return saved;

    }


    return [

      {

        id:
          Date.now(),

        role:
          "assistant",

        text:
          "Hi! I'm Mood Mentor 🌿. I'm here to support your wellbeing at work. Tell me how you're feeling or ask me anything about stress, mindfulness, focus, relaxation, or work-life balance.",

      },

    ];

  });


  const [
    input,
    setInput
  ] = useState("");


  const [
    loading,
    setLoading
  ] = useState(false);


  const messagesEndRef =
    useRef(null);


  const inputRef =
    useRef(null);


  // ==========================================================
  // SAVE CHAT HISTORY
  // ==========================================================

  useEffect(() => {

    localStorage.setItem(

      CHAT_STORAGE_KEY,

      JSON.stringify(
        messages
      )

    );

  }, [
    messages
  ]);


  // ==========================================================
  // AUTO SCROLL
  // ==========================================================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({

      behavior:
        "smooth",

    });

  }, [
    messages,
    loading
  ]);


  // ==========================================================
  // INITIAL INPUT FOCUS
  // ==========================================================

  useEffect(() => {

    inputRef.current?.focus();

  }, []);


  // ==========================================================
  // SEND MESSAGE
  // ==========================================================

  const sendMessage = async (
    customMessage = null
  ) => {

    const trimmedMessage = (

      customMessage ??
      input

    ).trim();


    if (
      !trimmedMessage
      ||
      loading
    ) {

      return;

    }


    // ========================================================
    // GET EMPLOYEE INFORMATION
    // ========================================================

    const employee =
      getEmployee();


    const employeeId =
      getEmployeeId(
        employee
      );


    const employeeName =
      getEmployeeName(
        employee
      );


    // ========================================================
    // GET MOOD
    // ========================================================

    const latestMood =
      getLatestMood();


    // ========================================================
    // GET ACTIVITIES
    // ========================================================

    const completedActivities =
      getCompletedActivities();


    // ========================================================
    // USER MESSAGE
    // ========================================================

    const userMessage = {

      id:
        Date.now(),

      role:
        "user",

      text:
        trimmedMessage,

    };


    const updatedMessages = [

      ...messages,

      userMessage,

    ];


    setMessages(
      updatedMessages
    );


    setInput("");

    setLoading(true);


    try {

      // ======================================================
      // RECENT CONVERSATION
      // ======================================================

      const conversation =

        updatedMessages

          .slice(-8)

          .map(
            (message) => ({

              role:
                message.role,

              text:
                message.text,

            })
          );


      // ======================================================
      // SEND TO FLASK
      // ======================================================

      const response =
        await fetch(

          `${API_URL}/api/chat`,

          {

            method:
              "POST",

            headers: {

              "Content-Type":
                "application/json",

            },

            body:
              JSON.stringify({

                message:
                  trimmedMessage,

                employee: {

                  // Employee ID is used locally
                  // for app context but is NOT
                  // sent to Gemini by backend.

                  employeeId:
                    employeeId,

                  name:
                    employeeName,

                  department:
                    employee.department
                    ||
                    "Not specified",

                },

                mood: {

                  mood:
                    latestMood.mood,

                  score:
                    latestMood.score,

                },

                activities:
                  completedActivities,

                conversation:
                  conversation,

              }),

          }

        );


      const data =
        await response.json();


      if (
        !response.ok
        ||
        !data.success
      ) {

        throw new Error(

          data.message
          ||
          "Unable to get a response."

        );

      }


      // ======================================================
      // READ AI RESPONSE
      // ======================================================

      const aiResponse =

        data.response

        ||

        data.reply

        ||

        data.answer

        ||

        data.text

        ||

        data.message;


      if (!aiResponse) {

        throw new Error(
          "AI did not return a response."
        );

      }


      // ======================================================
      // ADD AI MESSAGE
      // ======================================================

      setMessages(
        (previous) => [

          ...previous,

          {

            id:
              Date.now() + 1,

            role:
              "assistant",

            text:
              aiResponse,

          },

        ]

      );


    } catch (error) {

      console.error(
        "Chatbot error:",
        error
      );


      // ======================================================
      // ERROR MESSAGE
      // ======================================================

      setMessages(
        (previous) => [

          ...previous,

          {

            id:
              Date.now() + 1,

            role:
              "assistant",

            text:
              "I'm having trouble connecting to my wellness assistant right now. Please make sure your Flask backend is running and try again. 🌿",

            error:
              true,

          },

        ]

      );


    } finally {

      setLoading(false);


      setTimeout(() => {

        inputRef.current?.focus();

      }, 50);

    }

  };


  // ==========================================================
  // ENTER KEY
  // ==========================================================

  const handleKeyDown = (
    event
  ) => {

    if (

      event.key ===
      "Enter"

      &&

      !event.shiftKey

    ) {

      event.preventDefault();

      sendMessage();

    }

  };


  // ==========================================================
  // CLEAR CHAT
  // ==========================================================

  const clearChat = () => {

    const welcomeMessage = {

      id:
        Date.now(),

      role:
        "assistant",

      text:
        "Hi! I'm Mood Mentor 🌿. I'm here to support your wellbeing at work. How are you feeling today?",

    };


    setMessages([

      welcomeMessage,

    ]);


    localStorage.removeItem(
      CHAT_STORAGE_KEY
    );


    setTimeout(() => {

      inputRef.current?.focus();

    }, 50);

  };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#080B14] via-[#11112A] to-[#080B14] text-white">


      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />

      </div>


      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="relative z-10 border-b border-white/10 bg-[#080B14]/80 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">


          {/* BRAND */}

          <button

            type="button"

            onClick={() =>
              navigate("/dashboard")
            }

            className="flex items-center gap-3 text-left"

          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 shadow-lg shadow-purple-900/30">

              <Sparkles size={20} />

            </div>


            <div>

              <h1 className="text-lg font-bold">

                Mood Mentor

              </h1>


              <p className="text-xs text-zinc-500">

                AI Wellness Assistant

              </p>

            </div>

          </button>


          {/* NAV ACTIONS */}

          <div className="flex items-center gap-3">


            {/* CLEAR */}

            <button

              type="button"

              onClick={
                clearChat
              }

              className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-400 transition hover:border-purple-500/30 hover:text-white sm:flex"

            >

              <Trash2 size={16} />

              Clear Chat

            </button>


            {/* DASHBOARD */}

            <button

              type="button"

              onClick={() =>
                navigate("/dashboard")
              }

              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300 transition hover:border-indigo-500/30 hover:text-white"

            >

              <ArrowLeft size={16} />

              Dashboard

            </button>


          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col px-4 py-6 sm:px-6 lg:py-8">


        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <div className="mb-6">


          <div className="mb-3 flex items-center gap-3">


            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-violet-600/20 text-violet-300 ring-1 ring-purple-500/20">

              <Bot size={25} />

            </div>


            <div>

              <h2 className="text-2xl font-bold sm:text-3xl">

                AI Wellness Mentor

              </h2>


              <p className="mt-1 text-sm text-zinc-500">

                Personalized support for your workday

              </p>

            </div>

          </div>


          {/* PERSONALIZED AI INFO */}

          <div className="rounded-2xl border border-purple-500/10 bg-purple-500/[0.04] px-4 py-3 text-sm text-zinc-400">

            <span className="font-medium text-violet-300">

              ✨ Personalized AI

            </span>

            {" — "}

            Mood Mentor adapts its suggestions using your
            recent wellbeing context and conversation.

          </div>

        </div>


        {/* ===================================================
            CHAT CONTAINER
        =================================================== */}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0D1324]/90 shadow-2xl shadow-black/30 backdrop-blur-xl">


          {/* =================================================
              MESSAGES
          ================================================= */}

          <div className="min-h-[500px] max-h-[58vh] overflow-y-auto p-4 sm:p-6">


            {messages.map(
              (message) => {

                const isUser =
                  message.role ===
                  "user";


                return (

                  <div

                    key={
                      message.id
                    }

                    className={`mb-5 flex gap-3 ${
                      isUser
                        ? "justify-end"
                        : "justify-start"
                    }`}

                  >


                    {/* AI ICON */}

                    {!isUser && (

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 shadow-lg shadow-purple-900/20">

                        <Bot size={17} />

                      </div>

                    )}


                    {/* MESSAGE */}

                    <div

                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${

                        isUser

                          ? "rounded-br-md bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-lg shadow-purple-900/20"

                          : message.error

                          ? "rounded-bl-md border border-red-500/20 bg-red-500/[0.06] text-zinc-300"

                          : "rounded-bl-md border border-white/10 bg-white/[0.04] text-zinc-200"

                      }`}

                    >

                      {message.text}

                    </div>


                    {/* USER ICON */}

                    {isUser && (

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-300">

                        <User size={17} />

                      </div>

                    )}

                  </div>

                );

              }

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

              <div className="mb-5 flex gap-3">


                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600">

                  <Bot size={17} />

                </div>


                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-400">

                  <Loader2

                    size={16}

                    className="animate-spin text-violet-400"

                  />

                  Mood Mentor is thinking...

                </div>

              </div>

            )}


            <div
              ref={
                messagesEndRef
              }
            />

          </div>


          {/* =================================================
              QUICK PROMPTS
          ================================================= */}

          <div className="border-t border-white/10 px-4 py-4 sm:px-6">


            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-600">

              Try asking

            </p>


            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">


              {QUICK_PROMPTS.map(
                (prompt) => {

                  const Icon =
                    prompt.icon;


                  return (

                    <button

                      key={
                        prompt.text
                      }

                      type="button"

                      disabled={
                        loading
                      }

                      onClick={() =>
                        sendMessage(
                          prompt.text
                        )
                      }

                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-3 text-left text-sm text-zinc-400 transition hover:border-purple-500/30 hover:bg-purple-500/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"

                    >

                      <Icon

                        size={16}

                        className="shrink-0 text-violet-400"

                      />


                      <span>

                        {prompt.text}

                      </span>

                    </button>

                  );

                }

              )}

            </div>

          </div>


          {/* =================================================
              INPUT
          ================================================= */}

          <div className="border-t border-white/10 p-4 sm:p-6">


            <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-[#080B14] p-2 transition focus-within:border-purple-500/40 focus-within:ring-2 focus-within:ring-purple-500/10">


              <textarea

                ref={
                  inputRef
                }

                value={
                  input
                }

                onChange={(event) =>
                  setInput(
                    event.target.value
                  )
                }

                onKeyDown={
                  handleKeyDown
                }

                placeholder="Tell Mood Mentor how you're feeling..."

                rows={1}

                disabled={
                  loading
                }

                className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 disabled:cursor-not-allowed"

              />


              <button

                type="button"

                onClick={() =>
                  sendMessage()
                }

                disabled={
                  loading
                  ||
                  !input.trim()
                }

                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-lg shadow-purple-900/20 transition hover:from-indigo-500 hover:via-purple-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-40"

              >

                {loading ? (

                  <Loader2

                    size={19}

                    className="animate-spin"

                  />

                ) : (

                  <Send size={19} />

                )}

              </button>


            </div>


            {/* DISCLAIMER */}

            <p className="mt-3 text-center text-xs text-zinc-600">

              Mood Mentor provides wellness guidance and is
              not a substitute for professional medical care.

            </p>

          </div>


        </div>

      </main>

    </div>

  );

}