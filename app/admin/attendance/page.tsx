'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  Play,
  Square,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Users,
  RefreshCw,
  Timer,
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

export default function AttendancePage() {
  const { authAxios, user } = useAuth();
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [time, setTime] = useState('');
  const [dateStr, setDateStr] = useState('');

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await authAxios.get('/api/attendance');
      if (response.data.success) {
        const data: AttendanceLog[] = response.data.attendanceLogs;
        setLogs(data);

        if (user?.role === 'Employee') {
          const today = new Date().toISOString().split('T')[0];
          const activeLog = data.find((log) => log.date === today && !log.clockOut);
          if (activeLog) {
            setIsClockedIn(true);
            setClockInTime(activeLog.clockIn);
          } else {
            setIsClockedIn(false);
            setClockInTime(null);
            setElapsedTime('00:00:00');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching attendance logs:', error);
      toast.error('Failed to load attendance logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour12: false }));
      setDateStr(
        now.toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isClockedIn && clockInTime) {
      const calculateElapsed = () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const clockInDate = new Date(`${todayStr}T${clockInTime}:00`);
        const now = new Date();
        const diffMs = now.getTime() - clockInDate.getTime();
        if (diffMs < 0) { setElapsedTime('00:00:00'); return; }
        const secs  = Math.floor((diffMs / 1000) % 60);
        const mins  = Math.floor((diffMs / (1000 * 60)) % 60);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        );
      };
      calculateElapsed();
      timerRef.current = setInterval(calculateElapsed, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsedTime('00:00:00');
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isClockedIn, clockInTime]);

  useEffect(() => {
    if (authAxios) fetchAttendance();
  }, [authAxios]);

  const handlePunch = async () => {
    const action = isClockedIn ? 'clock-out' : 'clock-in';
    try {
      const response = await authAxios.post('/api/attendance', { action });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchAttendance();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Punch operation failed');
    }
  };

  const today       = new Date().toISOString().split('T')[0];
  const todayLogs   = logs.filter((log) => log.date === today);
  const presentCount = todayLogs.length;
  const lateCount   = todayLogs.filter((log) => log.status === 'Late').length;
  const onTimeCount = presentCount - lateCount;

  return (
    <DashboardLayout>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Attendance
            <span className="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full px-2.5 py-0.5">
              {logs.length} Records
            </span>
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            {user?.role === 'Employee'
              ? 'Punch in/out and view your daily work session logs'
              : 'Monitor employee attendance records and check-in statuses'}
          </p>
        </div>
        {user?.role !== 'Employee' && (
          <button
            onClick={fetchAttendance}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/8 border border-white/8 transition-all cursor-pointer"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        )}
      </div>

      {user?.role === 'Employee' ? (
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1">
            <div className="glass-panel rounded-2xl border border-white/[0.06] overflow-hidden">
              
              <div className="relative p-6 text-center border-b border-white/[0.06] bg-gradient-to-b from-violet-900/20 to-transparent">
                <div className="absolute top-3 left-4 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Live</span>
                </div>
                <p className="text-4xl font-extrabold text-white tracking-widest font-mono mt-4">
                  {time || '00:00:00'}
                </p>
                <p className="text-slate-500 text-xs mt-2">{dateStr}</p>
              </div>

              <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Timer size={12} className="text-slate-500" />
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Session Duration</p>
                </div>
                <h2 className="text-3xl font-extrabold text-white font-mono tracking-tight my-3">
                  {elapsedTime}
                </h2>

                <button
                  onClick={handlePunch}
                  className={`w-full mt-2 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-lg transition-all active:scale-95 border cursor-pointer ${
                    isClockedIn
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white border-red-500/30 shadow-red-900/20'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-violet-500/30 shadow-violet-900/20'
                  }`}
                >
                  {isClockedIn ? (
                    <><Square size={15} fill="white" /> Clock Out</>
                  ) : (
                    <><Play size={15} fill="white" /> Clock In</>
                  )}
                </button>

                {isClockedIn && clockInTime && (
                  <p className="text-[10px] text-slate-500 mt-3">
                    Started at <span className="text-slate-300 font-bold">{clockInTime}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="glass-panel rounded-2xl p-6 border border-white/[0.06]">
              <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                <Clock size={14} className="text-violet-400" />
                My Attendance Log
              </h3>

              {loading ? (
                <div className="py-12 flex justify-center">
                  <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : logs.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <Calendar size={32} className="mx-auto text-slate-600 mb-2" />
                  <p className="text-xs">No clock logs recorded yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="pb-3 pr-4">Date</th>
                        <th className="pb-3 pr-4">Punch In</th>
                        <th className="pb-3 pr-4">Punch Out</th>
                        <th className="pb-3 pr-4">Duration</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {logs.map((log) => (
                        <tr key={log.id} className="text-slate-300 hover:bg-white/2 transition-colors">
                          <td className="py-3 pr-4 font-semibold text-slate-200">{log.date}</td>
                          <td className="py-3 pr-4 font-mono text-cyan-400">{log.clockIn}</td>
                          <td className="py-3 pr-4 font-mono text-slate-400">{log.clockOut || <span className="text-emerald-400 animate-pulse">Active</span>}</td>
                          <td className="py-3 pr-4 font-mono font-bold text-white">
                            {log.totalHours ? `${log.totalHours}h` : '—'}
                          </td>
                          <td className="py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              log.status === 'On-Time'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
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
          </div>
        </div>
      ) : (
        
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="relative glass-panel rounded-2xl p-5 border border-white/[0.06] overflow-hidden group hover:border-white/[0.12] transition-all">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-blue-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start justify-between mb-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Present Today</p>
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 flex items-center justify-center">
                  <Users size={16} />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white tracking-tight">{presentCount}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="text-[11px] text-slate-500 font-medium">Clocked in members</span>
              </div>
            </div>

            <div className="relative glass-panel rounded-2xl p-5 border border-white/[0.06] overflow-hidden group hover:border-white/[0.12] transition-all">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start justify-between mb-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">On-Time</p>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white tracking-tight">{onTimeCount}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-slate-500 font-medium">Before 09:15 AM</span>
              </div>
            </div>

            <div className="relative glass-panel rounded-2xl p-5 border border-white/[0.06] overflow-hidden group hover:border-white/[0.12] transition-all">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-orange-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start justify-between mb-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Late Arrivals</p>
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-400 flex items-center justify-center">
                  <AlertTriangle size={16} />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white tracking-tight">{lateCount}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[11px] text-slate-500 font-medium">After 09:15 AM</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Roster Attendance Feed</h3>
              <span className="text-[10px] text-slate-500 font-medium">{logs.length} total records</span>
            </div>

            {loading ? (
              <div className="py-16 flex justify-center">
                <div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : logs.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <Calendar size={36} className="mx-auto text-slate-600 mb-3" />
                <p className="text-xs font-semibold">No attendance records found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Clock In</th>
                      <th className="px-6 py-4">Clock Out</th>
                      <th className="px-6 py-4">Duration</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {logs.map((log) => (
                      <tr key={log.id} className="text-slate-300 hover:bg-white/2 transition-colors text-xs">
                        <td className="px-6 py-3.5 font-mono text-slate-600">{log.id}</td>
                        <td className="px-6 py-3.5 font-bold text-white">{log.employeeName}</td>
                        <td className="px-6 py-3.5 text-slate-400">{log.date}</td>
                        <td className="px-6 py-3.5 font-mono text-cyan-400">{log.clockIn}</td>
                        <td className="px-6 py-3.5 font-mono text-slate-400">
                          {log.clockOut || <span className="text-emerald-400">Active</span>}
                        </td>
                        <td className="px-6 py-3.5 font-mono font-bold text-white">
                          {log.totalHours ? `${log.totalHours}h` : '—'}
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            log.status === 'On-Time'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
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
        </div>
      )}
    </DashboardLayout>
  );
}
