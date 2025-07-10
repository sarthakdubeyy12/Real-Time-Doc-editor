import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import React from "react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full -top-16 -left-20 blur-[100px] animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-cyan-400/10 rounded-full bottom-10 right-10 blur-[90px] animate-ping"></div>

      <div className="z-10 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl px-10 py-12 w-full max-w-md text-white">
        <h2 className="text-3xl font-semibold text-center mb-6">Welcome Back</h2>

        {error && (
          <div className="bg-red-200 text-red-800 p-2 mb-4 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 transition-colors duration-300 text-white font-semibold py-2 rounded-lg"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-white/60 mt-6">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-cyan-400 hover:underline hover:text-cyan-300"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;