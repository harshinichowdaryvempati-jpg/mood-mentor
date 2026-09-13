import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";

const API_URL = "http://127.0.0.1:5000";

export default function Login() {
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // LOGIN
  // ============================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!employeeId.trim()) {
      setError("Please enter your Employee ID.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: employeeId.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Invalid Employee ID or password."
        );
      }

      // ========================================================
      // NORMALIZE EMPLOYEE DATA
      // ========================================================

      const employee = data.employee || data.user || data;

      const userData = {
        employeeId:
          employee.employeeId ||
          employee.employee_id ||
          employeeId.trim(),

        employee_id:
          employee.employee_id ||
          employee.employeeId ||
          employeeId.trim(),

        fullName:
          employee.fullName ||
          employee.full_name ||
          employee.name ||
          employee.username ||
          employee.email?.split("@")[0] ||
          "User",

        full_name:
          employee.full_name ||
          employee.fullName ||
          employee.name ||
          employee.username ||
          employee.email?.split("@")[0] ||
          "User",

        name:
          employee.name ||
          employee.fullName ||
          employee.full_name ||
          employee.username ||
          employee.email?.split("@")[0] ||
          "User",

        email: employee.email || "",

        department: employee.department || "",
      };

      // ========================================================
      // SAVE LOGIN INFORMATION
      // ========================================================

      const loginData = {
        ...data,
        employee: userData,
      };

      localStorage.setItem(
        "moodMentorLoggedIn",
        JSON.stringify(loginData)
      );

      localStorage.setItem(
        "moodMentorEmployee",
        JSON.stringify(userData)
      );

      localStorage.setItem(
        "moodMentorEmployeeId",
        userData.employeeId
      );

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      localStorage.setItem(
        "currentUser",
        JSON.stringify(userData)
      );

      localStorage.setItem(
        "moodMentorLoggedInStatus",
        "true"
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.message ||
          "Unable to connect to Mood Mentor. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#080B14] text-white overflow-hidden">

      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 pointer-events-none">

        {/* Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.12]"
          style={{
            backgroundImage: "url('/moodmentor.jpeg')",
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#080B14]/85" />

        {/* Indigo glow */}
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[150px]" />

        {/* Purple glow */}
        <div className="absolute right-[-180px] top-[20%] h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[150px]" />

        {/* Violet glow */}
        <div className="absolute bottom-[-250px] left-[35%] h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[160px]" />

      </div>

      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <nav className="relative z-20 flex items-center justify-between px-6 py-6 lg:px-12">

        {/* Logo */}

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-600 shadow-lg shadow-purple-900/30">

            <Brain
              size={23}
              className="text-white"
            />

          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Mood Mentor
            </h1>

            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Employee Wellness
            </p>
          </div>

        </div>

        {/* Create account */}

        <button
          onClick={() => navigate("/create-account")}
          className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-purple-400/30 hover:bg-purple-500/10 hover:text-white"
        >
          Create Account
          <ArrowRight
            size={15}
            className="transition group-hover:translate-x-1"
          />
        </button>

      </nav>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="relative z-10 flex min-h-[calc(100vh-90px)] items-center px-6 py-10 lg:px-12">

        <div className="mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">

          {/* ==================================================
              LEFT SIDE
          ================================================== */}

          <section className="hidden lg:block">

            {/* Small badge */}

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">

              <Sparkles size={15} />

              AI-powered wellness support

            </div>

            {/* Main heading */}

            <h2 className="max-w-2xl text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">

              Your wellbeing
              <br />

              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
                deserves attention.
              </span>

            </h2>

            {/* Description */}

            <p className="mt-7 max-w-xl text-lg leading-8 text-zinc-400">

              A smarter way to understand your mood, manage
              workplace stress, and build healthier everyday
              habits with personalized AI wellness support.

            </p>

            {/* Feature cards */}

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">

              {/* Card 1 */}

              <div className="rounded-2xl border border-white/10 bg-[#0D1324]/70 p-4 backdrop-blur-xl">

                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">

                  <Sparkles size={18} />

                </div>

                <p className="text-sm font-semibold text-white">
                  AI Insights
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Personalized support
                </p>

              </div>

              {/* Card 2 */}

              <div className="rounded-2xl border border-white/10 bg-[#0D1324]/70 p-4 backdrop-blur-xl">

                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">

                  <HeartPulse size={18} />

                </div>

                <p className="text-sm font-semibold text-white">
                  Mood Tracking
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Understand your wellbeing
                </p>

              </div>

              {/* Card 3 */}

              <div className="rounded-2xl border border-white/10 bg-[#0D1324]/70 p-4 backdrop-blur-xl">

                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">

                  <ShieldCheck size={18} />

                </div>

                <p className="text-sm font-semibold text-white">
                  Private
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Designed for employees
                </p>

              </div>

            </div>

          </section>

          {/* ==================================================
              LOGIN PANEL
          ================================================== */}

          <section className="mx-auto w-full max-w-[440px]">

            {/* Mobile branding */}

            <div className="mb-7 text-center lg:hidden">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-600">

                <Brain size={28} />

              </div>

              <h1 className="text-2xl font-bold">
                Mood Mentor
              </h1>

            </div>

            {/* Login card */}

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0D1324]/90 p-7 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-9">

              {/* Top gradient line */}

              <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500" />

              {/* Soft inner glow */}

              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-purple-600/10 blur-3xl" />

              {/* Header */}

              <div className="relative mb-8">

                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
                  Employee Portal
                </p>

                <h3 className="text-3xl font-bold tracking-tight text-white">
                  Welcome back
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Sign in to continue your wellness journey.
                </p>

              </div>

              {/* Error */}

              {error && (
                <div className="relative mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">

                  <p className="text-sm text-red-300">
                    {error}
                  </p>

                </div>
              )}

              {/* ==================================================
                  FORM
              ================================================== */}

              <form
                onSubmit={handleLogin}
                className="relative space-y-5"
              >

                {/* Employee ID */}

                <div>

                  <label
                    htmlFor="employeeId"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Employee ID
                  </label>

                  <input
                    id="employeeId"
                    type="text"
                    value={employeeId}
                    onChange={(e) =>
                      setEmployeeId(e.target.value)
                    }
                    placeholder="Enter your employee ID"
                    autoComplete="username"
                    disabled={loading}
                    className="h-13 w-full rounded-xl border border-white/10 bg-[#080B14] px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/15 focus:border-indigo-500/70 focus:bg-[#0A0F1D] focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>

                {/* Password */}

                <div>

                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Password
                  </label>

                  <div className="relative">

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                      className="h-13 w-full rounded-xl border border-white/10 bg-[#080B14] px-4 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/15 focus:border-indigo-500/70 focus:bg-[#0A0F1D] focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-indigo-300"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >

                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}

                    </button>

                  </div>

                </div>

                {/* Sign in */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition duration-200 hover:-translate-y-0.5 hover:from-indigo-500 hover:via-purple-500 hover:to-violet-500 hover:shadow-xl hover:shadow-purple-900/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In

                      <ArrowRight
                        size={17}
                        className="transition group-hover:translate-x-1"
                      />
                    </>
                  )}

                </button>

              </form>

              {/* ==================================================
                  CREATE ACCOUNT
              ================================================== */}

              <div className="mt-7 text-center">

                <span className="text-sm text-zinc-500">
                  Don't have an account?
                </span>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/create-account")
                  }
                  className="ml-2 text-sm font-semibold text-indigo-400 transition hover:text-violet-300"
                >
                  Create one
                </button>

              </div>

              {/* Bottom note */}

              <div className="mt-7 border-t border-white/5 pt-5 text-center">

                <p className="text-[11px] text-zinc-600">
                  Mood Mentor • AI-powered Employee Wellness
                </p>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}