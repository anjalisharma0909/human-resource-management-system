"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [devToken, setDevToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setDevToken("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to process request");
      }

      setMessage(data.message);
      if (data.token) {
        setDevToken(data.token);
      }
    } catch (err: any) {
      setError(err.message || "Connection failed to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center p-4">
      <div className="bg-[#14161f] p-8 rounded-xl border border-gray-800 w-full max-w-sm shadow-2xl">
        <h2 className="text-white text-2xl font-bold mb-1 text-center">Forgot Password</h2>
        <p className="text-gray-400 text-xs text-center mb-6">Enter your email to get a reset token</p>

        {error && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-2.5 rounded text-xs mb-4 text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/10 text-green-400 border border-green-500/20 p-3 rounded text-xs mb-4 text-center">
            {message}
            {devToken && (
              <div className="mt-3 p-3 bg-black/40 rounded border border-gray-700 break-all select-all font-mono text-xs text-white text-left">
                <p className="text-gray-400 mb-1">🔑 Your Reset Token (Copy this):</p>
                {devToken}
                <button
                  type="button"
                  onClick={() => router.push("/reset-password")}
                  className="mt-3 w-full bg-purple-600 text-white p-2 rounded text-xs font-semibold hover:bg-purple-700 transition cursor-pointer"
                >
                  Go to Reset Password →
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Corporate Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-[#1c1f2b] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
              placeholder="name@company.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white p-3 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Processing..." : "Send Reset Token"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-xs text-gray-500 hover:text-purple-400 transition bg-transparent border-none outline-none cursor-pointer"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}