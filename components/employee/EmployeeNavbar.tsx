'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Search, ChevronDown, UserCircle } from 'lucide-react';

export default function EmployeeNavbar() {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-white/5 bg-[#0d0a21]/60 backdrop-blur-md flex items-center justify-between px-8 relative z-20">
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-white/5 border border-white/8 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500/40 focus:border-violet-500/30 transition-all"
        />
      </div>

      <Link
        href="/employee/profile"
        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-all group"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border border-white/10 group-hover:border-violet-500/40 transition-all"
          />
        ) : (
          <UserCircle className="w-8 h-8 text-slate-400" />
        )}
        <div className="text-right">
          <p className="text-xs font-bold text-white leading-none">{user?.name}</p>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">{user?.role}</p>
        </div>
        <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-colors" />
      </Link>
    </header>
  );
}
