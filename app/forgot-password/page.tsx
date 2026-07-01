'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Mail, ArrowLeft, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successLink, setSuccessLink] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      if (response.data.success) {
        setSuccessLink(response.data.resetLink);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'User with this email could not be found.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#070510] overflow-hidden px-4">
      <div className="glow-blob glow-purple w-[400px] h-[400px] -top-20 -left-20 animate-pulse-glow"></div>
      <div className="glow-blob glow-cyan w-[500px] h-[500px] -bottom-30 -right-20 animate-pulse-glow" style={{ animationDelay: '-5s' }}></div>

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Login
        </Link>

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/30 border border-violet-400/20 mb-3">
            <ShieldCheck className="w-8 h-8 text-cyan-300" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Reset Password
          </h1>
          <p className="text-slate-400 text-sm mt-1">Recover access to your account</p>
        </div>

        <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl">
          {!successLink ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-sm text-slate-300">
                Enter your registered email address below, and we'll generate a secure password reset link for you.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl glass-input"
                  />
                </div>
                {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg border border-violet-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Send Reset Request'
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Reset Link Generated</h3>
                <p className="text-sm text-slate-400 mt-2">
                  We have simulated generating a password recovery token. You can click the button below to reset your password directly.
                </p>
              </div>

              <Link
                href={successLink}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg border border-emerald-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                Reset Password Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
