"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import SignupPage from "../signup/page";

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Invalid login credentials");
      }

     
      const rawName = data.username || data.name || email.split("@")[0];
      const finalDisplayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      
      //login(data.access_token, data.refresh_token, data.role || "Admin", email, finalDisplayName);

      login(
  data.access_token, 
  data.refresh_token, 
  data.role, 
  data.email, 
  data.name, 
  data.user_id 
);
    } catch (err: any) {
      setError(err.message || "Connection failed to server");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoginView) {
    return <SignupPage switchToLogin={() => setIsLoginView(true)} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0e12] px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#14161f] p-8 shadow-xl border border-gray-800">
        <h2 className="text-3xl font-bold text-white text-center mb-2">HRMS Portal</h2>
        <p className="text-gray-400 text-sm text-center mb-8">Sign in to manage your workspace</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-[#1c1e2a] border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-[#1c1e2a] border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700 transition disabled:opacity-50 cursor-pointer text-sm"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          Don't have an administrative account?{" "}
          <button 
            type="button"
            onClick={() => setIsLoginView(false)} 
            className="text-purple-400 hover:underline font-medium cursor-pointer bg-transparent border-none outline-none"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}

