import React, { useState } from "react";
import { User, Lock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import logo from "./assets/logo.png";
import { API_ENDPOINTS, fetchAPI } from "./config/api";

const GlassLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await fetchAPI(API_ENDPOINTS.LOGIN, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/services");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/campus.jpg"
          alt="Campus Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0B1D36]/80 mix-blend-multiply"></div>
      </div>

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-md p-8 m-4 rounded-2xl border border-white/30 shadow-2xl backdrop-blur-md bg-white/10">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 mb-4 flex items-center justify-center">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <h2 className="text-3xl font-bold text-white">GIM Lost & Found</h2>
          <p className="text-blue-200/80 text-sm mt-2">Securely access the portal</p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>

          {/* Email */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-300" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300/30 rounded-lg bg-black/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-white/50"
              placeholder="Email Address (GIM.ac.in)"
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-300" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300/30 rounded-lg bg-black/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-white/50"
              placeholder="Password"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* Login Button */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-full bg-white text-[#0B1D36] font-bold shadow-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center space-y-2">
          <div className="text-sm text-gray-300">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-white hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-600 rounded-full blur-3xl opacity-30"></div>
    </div>
  );
};

export default GlassLogin;
