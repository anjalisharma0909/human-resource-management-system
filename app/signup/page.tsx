'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!adminName.trim()) tempErrors.adminName = 'Full name is required';
    if (!email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Enter a valid email address';
    }
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/auth/signup', {
        adminName,
        email,
        password,
      });

      if (response.data.success) {
        toast.success('Account created! Please sign in.');
        router.push('/login');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#070510] overflow-hidden px-4 py-12">
      
      <div className="glow-blob glow-purple w-[400px] h-[400px] -top-20 -right-20 animate-pulse-glow" />
      <div className="glow-blob glow-cyan w-[480px] h-[480px] -bottom-28 -left-20 animate-pulse-glow" style={{ animationDelay: '-5s' }} />

      <div className="relative z-10 w-full max-w-[420px] animate-slide-up">

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to login
        </Link>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-900/40 border border-violet-400/20 mb-4">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Admin Account</h1>
          <p className="text-slate-400 text-sm mt-1">Set up access for your organization</p>
        </div>

        <div className="glass-panel rounded-2xl p-7 border border-white/[0.08] shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="John Doe"
                  autoComplete="name"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg glass-input text-sm ${errors.adminName ? 'border-red-500/60' : ''}`}
                />
              </div>
              {errors.adminName && <p className="text-red-400 text-xs mt-1.5">{errors.adminName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg glass-input text-sm ${errors.email ? 'border-red-500/60' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg glass-input text-sm ${errors.password ? 'border-red-500/60' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg glass-input text-sm ${errors.confirmPassword ? 'border-red-500/60' : ''}`}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-lg shadow-md shadow-violet-900/30 border border-violet-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-1"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-5 pt-5 border-t border-white/[0.06] text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}