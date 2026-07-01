'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Building2,
  CalendarDays,
  Clock3,
  ArrowRight,
} from 'lucide-react';

export default function QuickAccess() {
  const { user } = useAuth();

  const allModules = [
    {
      title: 'Employees',
      subtitle: 'Manage organization profiles',
      icon: Users,
      href: '/admin/employees',
      color: 'from-blue-600/10 to-indigo-600/10 text-blue-400 border-blue-500/20',
      roles: ['Admin', 'Manager'],
    },
    {
      title: 'Departments',
      subtitle: 'Structure & budget allocations',
      icon: Building2,
      href: '/admin/departments',
      color: 'from-emerald-600/10 to-teal-600/10 text-emerald-400 border-emerald-500/20',
      roles: ['Admin', 'Manager'],
    },
    {
      title: 'Leave Manager',
      subtitle: 'Apply & approve requests',
      icon: CalendarDays,
      href: '/admin/leave',
      color: 'from-orange-600/10 to-amber-600/10 text-orange-400 border-amber-500/20',
      roles: ['Admin', 'Manager', 'Employee'],
    },
    {
      title: 'Attendance Tracker',
      subtitle: 'Punch check and active log tracker',
      icon: Clock3,
      href: '/admin/attendance',
      color: 'from-purple-600/10 to-pink-600/10 text-purple-400 border-purple-500/20',
      roles: ['Admin', 'Manager', 'Employee'],
    },
  ];

  const filteredModules = allModules.filter((m) =>
    user ? m.roles.includes(user.role) : false
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Quick Access</h2>
          <p className="text-slate-500 text-xs mt-0.5">Jump to any module</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredModules.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="glass-panel glass-card-hover rounded-2xl p-5 border border-white/5 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-tr border ${item.color}`}
                >
                  <Icon size={22} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <ArrowRight
                size={18}
                className="text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}