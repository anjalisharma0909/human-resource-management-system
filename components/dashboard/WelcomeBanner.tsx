'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { UserPlus, FileText, CalendarDays, Clock3 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WelcomeBanner() {
  const { user } = useAuth();

  const handleGenerateReport = () => {
    toast.success('Report generation simulated — CSV downloaded.');
  };

  const subtitles: Record<string, string> = {
    Admin:    'Manage employees, departments, leaves, and track attendance.',
    Manager:  'Review team leaves, track attendance, and view department stats.',
    Employee: 'Punch attendance, apply for leave, and manage your profile.',
  };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="relative rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 overflow-hidden border border-white/[0.07]"
      style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.25) 0%, rgba(79,70,229,0.15) 50%, rgba(8,6,18,0) 100%)' }}
    >
      
      <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
      <div className="absolute right-20 bottom-0 w-32 h-32 rounded-full bg-indigo-600/10 blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400">
            {user?.role} Portal &nbsp;·&nbsp; {today}
          </p>
        </div>
        <h2 className="text-lg font-bold text-white">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}
        </h2>
        <p className="text-slate-400 text-xs mt-0.5 max-w-sm">
          {subtitles[user?.role || ''] || ''}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 relative z-10 shrink-0">
        {user?.role === 'Admin' && (
          <>
            <Link
              href="/admin/employees"
              className="bg-violet-600 hover:bg-violet-500 text-white text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-violet-900/30"
            >
              <UserPlus size={13} />
              Add Employee
            </Link>
            <button
              onClick={handleGenerateReport}
              className="bg-white/6 hover:bg-white/10 text-slate-300 text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 border border-white/10 transition-all active:scale-95 cursor-pointer"
            >
              <FileText size={13} />
              Export Report
            </button>
          </>
        )}

        {user?.role === 'Manager' && (
          <>
            <Link
              href="/admin/leave"
              className="bg-violet-600 hover:bg-violet-500 text-white text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-violet-900/30"
            >
              <CalendarDays size={13} />
              Review Leaves
            </Link>
            <button
              onClick={handleGenerateReport}
              className="bg-white/6 hover:bg-white/10 text-slate-300 text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 border border-white/10 transition-all active:scale-95 cursor-pointer"
            >
              <FileText size={13} />
              Export Report
            </button>
          </>
        )}

        {user?.role === 'Employee' && (
          <>
            <Link
              href="/admin/attendance"
              className="bg-violet-600 hover:bg-violet-500 text-white text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-violet-900/30"
            >
              <Clock3 size={13} />
              Punch In
            </Link>
            <Link
              href="/admin/leave"
              className="bg-white/6 hover:bg-white/10 text-slate-300 text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 border border-white/10 transition-all active:scale-95"
            >
              <CalendarDays size={13} />
              Apply Leave
            </Link>
          </>
        )}
      </div>
    </div>
  );
}