'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  Clock3,
  User,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      roles: ['Admin', 'Manager', 'Employee'],
    },
    {
      name: 'Employees',
      href: '/admin/employees',
      icon: Users,
      roles: ['Admin', 'Manager'],
    },
    {
      name: 'Departments',
      href: '/admin/departments',
      icon: Building2,
      roles: ['Admin', 'Manager'],
    },
    {
      name: 'Leave',
      href: '/admin/leave',
      icon: CalendarDays,
      roles: ['Admin', 'Manager', 'Employee'],
    },
    {
      name: 'Attendance',
      href: '/admin/attendance',
      icon: Clock3,
      roles: ['Admin', 'Manager', 'Employee'],
    },
    {
      name: 'Profile',
      href: '/admin/profile',
      icon: User,
      roles: ['Admin', 'Manager', 'Employee'],
    },
  ];

  const filteredLinks = links.filter((link) =>
    user ? link.roles.includes(user.role) : false
  );

  return (
    <aside className="w-64 min-h-screen bg-[#0d0a21] border-r border-white/5 text-slate-100 flex flex-col relative z-25">
      
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center border border-violet-400/20 shadow-md shadow-violet-900/10">
          <ShieldCheck className="w-5 h-5 text-cyan-300" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            HRMS
          </h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">
            {user?.organization || 'Acme Corp'}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {filteredLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/20 border border-violet-500/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-4 bg-[#090718]/45">
        <div className="flex items-center gap-3 mb-4 px-2">
          
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&h=256&fit=crop'}
            alt="Avatar"
            className="w-9 h-9 rounded-full object-cover border border-white/10"
          />
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-white truncate">{user?.name}</h4>
            <p className="text-[11px] text-cyan-400 font-semibold uppercase tracking-wider truncate">
              {user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}