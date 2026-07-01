'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Hash, ArrowRight } from 'lucide-react';

type LoginMode = 'email' | 'employeeId';

export default function LoginPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState<LoginMode>('email');
  const [email, setEmail] = useState('shruti14@gmail.com');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const tempErrors: Record<string, string> = {};

    if (mode === 'email') {
      if (!email) {
        tempErrors.identifier = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        tempErrors.identifier = 'Enter a valid email address';
      }
    } else {
      if (!employeeId.trim()) {
        tempErrors.identifier = 'Employee ID is required';
      }
    }

    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const identifier = mode === 'email' ? email : employeeId;
    await login(identifier, password);
    setIsSubmitting(false);
  };

  const switchMode = (newMode: LoginMode) => {
    setMode(newMode);
    setErrors({});
    setEmail('');
    setEmployeeId('');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#070510] overflow-hidden px-4">
      
      <div className="glow-blob glow-purple w-[420px] h-[420px] -top-24 -left-24 animate-pulse-glow" />
      <div className="glow-blob glow-cyan w-[480px] h-[480px] -bottom-28 -right-24 animate-pulse-glow" style={{ animationDelay: '-4s' }} />

      <div className="relative z-10 w-full max-w-[420px] animate-slide-up">

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-lg shadow-violet-900/40 border border-violet-400/20 mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white" stroke="currentColor" strokeWidth="1.8">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">HRMS Portal</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to access your workspace</p>
        </div>

        <div className="glass-panel rounded-2xl p-7 border border-white/[0.08] shadow-2xl shadow-black/40">

          <div className="flex bg-white/5 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => switchMode('email')}
              className={`flex-1 text-sm py-2 rounded-md font-medium transition-all duration-200 ${
                mode === 'email'
                  ? 'bg-violet-600 text-white shadow shadow-violet-900/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => switchMode('employeeId')}
              className={`flex-1 text-sm py-2 rounded-md font-medium transition-all duration-200 ${
                mode === 'employeeId'
                  ? 'bg-violet-600 text-white shadow shadow-violet-900/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Employee ID
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {mode === 'email' ? 'Email Address' : 'Employee ID'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  {mode === 'email' ? <Mail className="w-4.5 h-4.5" /> : <Hash className="w-4.5 h-4.5" />}
                </span>
                {mode === 'email' ? (
                  <input
                    key="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    autoComplete="email"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg glass-input text-sm ${
                      errors.identifier ? 'border-red-500/60' : ''
                    }`}
                  />
                ) : (
                  <input
                    key="empid-input"
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                    placeholder="EMP001"
                    autoComplete="username"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg glass-input text-sm tracking-widest ${
                      errors.identifier ? 'border-red-500/60' : ''
                    }`}
                  />
                )}
              </div>
              {errors.identifier && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                  {errors.identifier}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4.5 h-4.5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg glass-input text-sm ${
                    errors.password ? 'border-red-500/60' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                  {errors.password}
                </p>
              )}
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none group w-fit">
              <input
                id="remember_me"
                type="checkbox"
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-violet-600 focus:ring-violet-500/40 focus:ring-offset-0"
              />
              <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                Keep me signed in
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-lg shadow-md shadow-violet-900/30 border border-violet-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[0.06] text-center text-sm text-slate-500">
            New organization?{' '}
            <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Create an admin account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}