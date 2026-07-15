"use client";
import React, { useState } from "react";

interface SignupProps {
  switchToLogin?: () => void;
}

export default function SignupPage({ switchToLogin }: SignupProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [departmentName, setDepartmentName] = useState("HR");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        department_name: departmentName.trim(),
        email: email.trim(),
        password: password,
        role: role
      };

      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/signup", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        let errorMessage = "Registration failed.";
        if (data.detail && Array.isArray(data.detail)) {
          errorMessage = data.detail.map((err: any) => `${err.loc[1] || 'field'}: ${err.msg}`).join(", ");
        } else if (data.detail) {
          errorMessage = data.detail;
        }
        throw new Error(errorMessage);
      }

      setSuccess(true);
      setError("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        if (switchToLogin) {
          switchToLogin();
        } else {
          window.location.href = "/login";
        }
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Failed to write data into pgAdmin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0e12] px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#14161f] p-8 shadow-xl border border-gray-800">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Create Account</h2>
        <p className="text-gray-400 text-sm text-center mb-8">Register your credentials on HRMS Grid</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20 break-words">
            <strong>Validation Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-400 border border-emerald-500/20">
            Account written to pgAdmin successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl bg-[#1c1e2a] border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                placeholder="Om"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl bg-[#1c1e2a] border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                placeholder="Patel"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
            <input
              type="text"
              required
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="w-full rounded-xl bg-[#1c1e2a] border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
              placeholder="e.g. HR, IT"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-[#1c1e2a] border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
              placeholder="om01@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Account Authorization Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl bg-[#1c1e2a] border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
            >
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Secure Password</label>
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
            disabled={loading || success}
            className="w-full rounded-xl bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700 transition disabled:opacity-50 cursor-pointer text-sm mt-2"
          >
            {loading ? "Connecting Database..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-400">
          Already have an account?{" "}
          <button 
            type="button"
            onClick={switchToLogin} 
            className="text-purple-400 hover:underline font-medium cursor-pointer bg-transparent"
          >
            Sign In here
          </button>
        </div>
      </div>
    </div>
  );
}







