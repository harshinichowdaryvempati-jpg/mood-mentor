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
  UserPlus,
} from "lucide-react";

const API_URL = "http://127.0.0.1:5000";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "",
    email: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================================================
  // HANDLE INPUT CHANGE
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // ============================================================
  // HANDLE SIGNUP
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const {
      fullName,
      employeeId,
      email,
      department,
      password,
      confirmPassword,
    } = formData;

    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (
      !fullName.trim() ||
      !employeeId.trim() ||
      !email.trim() ||
      !department ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // --------------------------------------------------------
      // SEND DATA TO FLASK
      // --------------------------------------------------------

      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          fullName: fullName.trim(),
          employeeId: employeeId.trim(),
          email: email.trim(),
          department: department,
          password: password,
        }),
      });

      // --------------------------------------------------------
      // READ RESPONSE
      // --------------------------------------------------------

      let data = {};

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Invalid JSON response:", jsonError);
      }

      // --------------------------------------------------------
      // CHECK RESPONSE
      // --------------------------------------------------------

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Unable to create account. Please try again."
        );
        return;
      }

      // --------------------------------------------------------
      // SUCCESS
      // --------------------------------------------------------

      alert("Account created successfully!");

      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);

      setError(
        "Unable to connect to Mood Mentor backend. Please make sure Flask is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#080B14] text-white">

      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 pointer-events-none">

        {/* Subtle wellness image */}

        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.10]"
          style={{
            backgroundImage: "url('/moodmentor.jpeg')",
          }}
        />

        {/* Dark overlay */}

        <div className="absolute inset-0 bg-[#080B14]/90" />

        {/* Indigo glow */}

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[150px]" />

        {/* Purple glow */}

        <div className="absolute right-[-180px] top-[15%] h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[150px]" />

        {/* Violet glow */}

        <div className="absolute bottom-[-250px] left-[35%] h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[160px]" />

      </div>

      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <nav className="relative z-20 flex items-center justify-between px-6 py-6 lg:px-12">

        {/* Brand */}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-3"
        >

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-600 shadow-lg shadow-purple-900/30">

            <Brain
              size={23}
              className="text-white"
            />

          </div>

          <div className="text-left">

            <h1 className="text-lg font-bold tracking-tight">
              Mood Mentor
            </h1>

            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Employee Wellness
            </p>

          </div>

        </button>

        {/* Login */}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-purple-400/30 hover:bg-purple-500/10 hover:text-white"
        >
          Sign In

          <ArrowRight
            size={15}
            className="transition group-hover:translate-x-1"
          />

        </button>

      </nav>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="relative z-10 flex min-h-[calc(100vh-90px)] items-center px-6 py-8 lg:px-12">

        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">

          {/* ==================================================
              LEFT INFORMATION
          ================================================== */}

          <section className="hidden lg:block">

            {/* Badge */}

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">

              <Sparkles size={15} />

              Start your wellness journey

            </div>

            {/* Heading */}

            <h2 className="max-w-xl text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">

              Build a healthier
              <br />

              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
                workday.
              </span>

            </h2>

            <p className="mt-7 max-w-lg text-lg leading-8 text-zinc-400">

              Create your Mood Mentor account and discover
              personalized wellness activities, AI-powered
              insights, and tools designed to support your
              everyday wellbeing.

            </p>

            {/* Benefits */}

            <div className="mt-9 space-y-4">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">

                  <Sparkles size={19} />

                </div>

                <div>

                  <p className="text-sm font-semibold text-white">
                    Personalized AI Insights
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Wellness suggestions based on your needs
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">

                  <HeartPulse size={19} />

                </div>

                <div>

                  <p className="text-sm font-semibold text-white">
                    Track Your Wellbeing
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Monitor moods, activities and progress
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">

                  <ShieldCheck size={19} />

                </div>

                <div>

                  <p className="text-sm font-semibold text-white">
                    Employee-focused
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    A dedicated space for your wellbeing
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* ==================================================
              SIGNUP PANEL
          ================================================== */}

          <section className="mx-auto w-full max-w-[620px]">

            {/* Mobile branding */}

            <div className="mb-7 text-center lg:hidden">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-600">

                <Brain size={28} />

              </div>

              <h1 className="text-2xl font-bold">
                Mood Mentor
              </h1>

            </div>

            {/* Main card */}

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0D1324]/90 p-7 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-9">

              {/* Gradient top border */}

              <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500" />

              {/* Inner glow */}

              <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-purple-600/10 blur-3xl" />

              {/* Header */}

              <div className="relative mb-7">

                <div className="mb-3 flex items-center gap-2">

                  <UserPlus
                    size={17}
                    className="text-indigo-400"
                  />

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
                    Create Account
                  </p>

                </div>

                <h3 className="text-3xl font-bold tracking-tight text-white">
                  Join Mood Mentor
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Set up your employee wellness profile to get started.
                </p>

              </div>

              {/* Error */}

              {error && (
                <div className="relative mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">

                  <p className="text-sm leading-5 text-red-300">
                    {error}
                  </p>

                </div>
              )}

              {/* ==================================================
                  FORM
              ================================================== */}

              <form
                onSubmit={handleSubmit}
                className="relative"
              >

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  {/* FULL NAME */}

                  <div>

                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Full Name
                    </label>

                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-white/10 bg-[#080B14] px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/15 focus:border-indigo-500/70 focus:bg-[#0A0F1D] focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>

                  {/* EMPLOYEE ID */}

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
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      placeholder="Enter employee ID"
                      autoComplete="username"
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-white/10 bg-[#080B14] px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/15 focus:border-indigo-500/70 focus:bg-[#0A0F1D] focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Work Email
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      autoComplete="email"
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-white/10 bg-[#080B14] px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/15 focus:border-indigo-500/70 focus:bg-[#0A0F1D] focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>

                  {/* DEPARTMENT */}

                  <div>

                    <label
                      htmlFor="department"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Department
                    </label>

                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-white/10 bg-[#080B14] px-4 text-sm text-white outline-none transition hover:border-white/15 focus:border-indigo-500/70 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      <option
                        value=""
                        className="bg-[#080B14]"
                      >
                        Select department
                      </option>

                      <option
                        value="HR"
                        className="bg-[#080B14]"
                      >
                        Human Resources
                      </option>

                      <option
                        value="IT"
                        className="bg-[#080B14]"
                      >
                        Information Technology
                      </option>

                      <option
                        value="Finance"
                        className="bg-[#080B14]"
                      >
                        Finance
                      </option>

                      <option
                        value="Marketing"
                        className="bg-[#080B14]"
                      >
                        Marketing
                      </option>

                      <option
                        value="Operations"
                        className="bg-[#080B14]"
                      >
                        Operations
                      </option>

                      <option
                        value="Sales"
                        className="bg-[#080B14]"
                      >
                        Sales
                      </option>

                    </select>

                  </div>

                  {/* PASSWORD */}

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
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create password"
                        autoComplete="new-password"
                        disabled={loading}
                        className="h-12 w-full rounded-xl border border-white/10 bg-[#080B14] px-4 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/15 focus:border-indigo-500/70 focus:bg-[#0A0F1D] focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
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
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}

                      </button>

                    </div>

                  </div>

                  {/* CONFIRM PASSWORD */}

                  <div>

                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Confirm Password
                    </label>

                    <div className="relative">

                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        disabled={loading}
                        className="h-12 w-full rounded-xl border border-white/10 bg-[#080B14] px-4 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/15 focus:border-indigo-500/70 focus:bg-[#0A0F1D] focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        disabled={loading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-indigo-300"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >

                        {showConfirmPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}

                      </button>

                    </div>

                  </div>

                </div>

                {/* ==================================================
                    PRIVACY
                ================================================== */}

                <label className="mt-6 flex cursor-pointer items-start gap-3">

                  <input
                    type="checkbox"
                    required
                    disabled={loading}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-indigo-600"
                  />

                  <span className="text-xs leading-5 text-zinc-500">

                    I agree to the{" "}

                    <span className="font-medium text-indigo-400">
                      privacy policy
                    </span>

                    {" "}and understand that Mood Mentor is designed
                    to support employee wellbeing.

                  </span>

                </label>

                {/* ==================================================
                    CREATE ACCOUNT BUTTON
                ================================================== */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition duration-200 hover:-translate-y-0.5 hover:from-indigo-500 hover:via-purple-500 hover:to-violet-500 hover:shadow-xl hover:shadow-purple-900/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account

                      <ArrowRight
                        size={17}
                        className="transition group-hover:translate-x-1"
                      />
                    </>
                  )}

                </button>

              </form>

              {/* ==================================================
                  LOGIN LINK
              ================================================== */}

              <div className="mt-7 text-center">

                <span className="text-sm text-zinc-500">
                  Already have an account?
                </span>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="ml-2 text-sm font-semibold text-indigo-400 transition hover:text-violet-300"
                >
                  Sign In
                </button>

              </div>

              {/* ==================================================
                  FOOTER
              ================================================== */}

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
};

export default Signup;