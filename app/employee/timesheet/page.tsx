'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import EmployeeLayout from '@/components/employee/EmployeeLayout';
import {
  ClipboardList,
  Clock,
  TrendingUp,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AttendanceLog {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  totalHours?: number;
  status: 'On-Time' | 'Late' | 'Absent';
}

export default function TimesheetPage() {
  const { authAxios } = useAuth();
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await authAxios.get('/api/attendance');
      const all: AttendanceLog[] = res.data.attendanceLogs || [];
      // Show newest first
      setLogs([...all].reverse());
    } catch (err) {
      toast.error('Failed to load timesheet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authAxios) fetchLogs();
  }, [authAxios]);

  const totalDays = logs.length;
  const onTimeDays = logs.filter((l) => l.status === 'On-Time').length;
  const lateDays = logs.filter((l) => l.status === 'Late').length;
  const totalHours = logs.reduce((sum, l) => sum + (l.totalHours || 0), 0);

  const stats = [
    {
      label: 'Total Days',
      value: totalDays,
      icon: Calendar,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
    },
    {
      label: 'On Time',
      value: onTimeDays,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Late Arrivals',
      value: lateDays,
      icon: AlertCircle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Total Hours',
      value: `${totalHours.toFixed(1)}h`,
      icon: Clock,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
  ];

  return (
    <EmployeeLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <ClipboardList className="w-5 h-5 text-violet-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Timesheet</h1>
            <span className="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full px-2.5 py-0.5 font-bold">
              {totalDays} Records
            </span>
          </div>
          <p className="text-slate-400 text-xs">Your complete work session history and hours log</p>
        </div>

        <div className="flex items-center gap-1.5 bg-white/5 border border-white/8 backdrop-blur-md rounded-xl px-3 py-2">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-bold text-slate-300">
            {totalDays > 0 ? `${Math.round((onTimeDays / totalDays) * 100)}% On-Time Rate` : 'No data yet'}
          </span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`glass-panel rounded-2xl p-4 border ${s.bg} flex items-center gap-4`}
            >
              <div className={`w-10 h-10 rounded-xl ${s.bg} border flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{s.label}</p>
                <p className={`text-xl font-extrabold mt-0.5 ${s.color}`}>{loading ? '—' : s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timesheet Table */}
      <div className="glass-panel rounded-2xl p-6 border border-white/[0.06]">
        <div className="flex items-center gap-2 mb-5">
          <ClipboardList className="w-4 h-4 text-violet-400" />
          <h2 className="text-sm font-bold text-white">All Records</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Loading...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
            <ClipboardList className="w-10 h-10 text-slate-700" />
            <p className="text-sm font-semibold">No timesheet records yet</p>
            <p className="text-xs text-slate-600">Clock in from the Dashboard or Attendance page to start tracking.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pr-6">#</th>
                  <th className="pb-3 pr-6">Date</th>
                  <th className="pb-3 pr-6">Punch In</th>
                  <th className="pb-3 pr-6">Punch Out</th>
                  <th className="pb-3 pr-6">Duration</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {logs.map((log, idx) => (
                  <tr
                    key={log.id}
                    className="text-slate-300 hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-3.5 pr-6 text-slate-600 font-mono group-hover:text-slate-400 transition-colors">
                      {String(logs.length - idx).padStart(2, '0')}
                    </td>
                    <td className="py-3.5 pr-6 font-semibold text-slate-200">{log.date}</td>
                    <td className="py-3.5 pr-6 font-mono text-cyan-400">{log.clockIn}</td>
                    <td className="py-3.5 pr-6 font-mono">
                      {log.clockOut ? (
                        <span className="text-slate-400">{log.clockOut}</span>
                      ) : (
                        <span className="text-emerald-400 animate-pulse font-bold">Active</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-6 font-mono font-bold text-white">
                      {log.totalHours ? `${log.totalHours}h` : '—'}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          log.status === 'On-Time'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : log.status === 'Late'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
