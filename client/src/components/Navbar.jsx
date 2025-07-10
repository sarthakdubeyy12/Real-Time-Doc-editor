import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-md text-white px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-semibold tracking-wide text-cyan-400 hover:text-cyan-300 transition duration-300">
        DocEditor
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {user ? (
          <>
            <span className="hidden sm:inline text-white/80">Welcome, {user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 transition-colors px-4 py-1.5 rounded-md text-white font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-white/90 hover:text-cyan-300 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-white/90 hover:text-cyan-300 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;