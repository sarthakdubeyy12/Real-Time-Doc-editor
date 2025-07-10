import { useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import React from "react";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center overflow-hidden">
      {/* Animated soft glows */}
      <div className="absolute w-96 h-96 bg-cyan-400/20 rounded-full -top-20 -left-20 blur-[120px] animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-indigo-500/10 rounded-full bottom-10 right-10 blur-[100px] animate-ping"></div>

      <div className="z-10 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl px-10 py-12 w-full max-w-md text-white">
        <h2 className="text-3xl font-semibold text-center mb-6">Create Account</h2>

        {error && (
          <div className="bg-red-200 text-red-800 p-2 mb-4 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm text-white/80 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="e.g. harsh123"
              required
              className="w-full px-4 py-2 bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. harsh@example.com"
              required
              className="w-full px-4 py-2 bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
              className="w-full px-4 py-2 bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 transition-colors duration-300 text-white font-semibold py-2 rounded-lg"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-white/60 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-cyan-400 hover:underline hover:text-cyan-300"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;