import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Building2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const CreateAccount = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const {
      employeeId,
      name,
      email,
      department,
      password,
      confirmPassword,
    } = formData;

    // Validate fields
    if (
      !employeeId.trim() ||
      !name.trim() ||
      !email.trim() ||
      !department.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:5000/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId: employeeId.trim(),
            name: name.trim(),
            email: email.trim(),
            department: department.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to create account.");
        return;
      }

      alert("Account created successfully! 🌿");

      // Clear form
      setFormData({
        employeeId: "",
        name: "",
        email: "",
        department: "",
        password: "",
        confirmPassword: "",
      });

      // Go to Login
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);

      alert(
        "Unable to connect to the server. Please make sure the Mood Mentor backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-8 relative"
      style={{
        backgroundImage: "url('/moodmentor.jpeg')",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-7 sm:p-9">

          {/* Back to Login */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition mb-5"
          >
            <ArrowLeft size={18} />
            Back to Login
          </button>

          {/* Heading */}
          <div className="text-center mb-7">

            <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-3xl">🌿</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-800">
              Create Account
            </h1>

            <p className="text-gray-500 mt-2">
              Join Mood Mentor and start your wellness journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister}>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Employee ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="Enter Employee ID"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>

                <div className="relative">
                  <Building2
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Enter your department"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-6 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition duration-200 shadow-md ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
              }`}
            >
              {loading ? "Creating Account..." : "Create Account"}

              {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}

              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-green-600 font-semibold hover:text-green-700 hover:underline transition"
              >
                Login
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateAccount;