'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import EmployeeLayout from '@/components/employee/EmployeeLayout';
import StatCard from '@/components/dashboard/StatCard';
import {
  Building2,
  CalendarDays,
  Clock3,
  Activity,
  Calendar,
  Clock,
  Timer,
  Play,
  Square,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function EmployeeDashboardPage() {
  const { authAxios, user } = useAuth();
  const [empStats, setEmpStats] = useState({
    attendanceRate: '100%',
    daysPresent: '—',
    leaveBalance: '30 Days',
    pendingLeaves: '0 pending',
    deptName: 'Unassigned',
    deptManager: 'No Manager',
    isClockedIn: false,
    clockInTime: null as string | null,
  });

  const [time, setTime] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [todayLog, setTodayLog] = useState<any | null>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [empRes, deptRes, leaveRes, attRes] = await Promise.all([
        authAxios.get('/api/employees'),
        authAxios.get('/api/departments'),
        authAxios.get('/api/leave'),
        authAxios.get('/api/attendance'),
      ]);

      const employees = empRes.data.employees || [];
      const departments = deptRes.data.departments || [];
      const leaves = leaveRes.data.leaveRequests || [];
      const attendance = attRes.data.attendanceLogs || [];

      const selfEmp = employees[0];
      const dept = departments.find((d: any) => d.id === selfEmp?.departmentId);
      
      const approvedLeaves = leaves.filter((l: any) => l.status === 'Approved').length;
      const pendingCount = leaves.filter((l: any) => l.status === 'Pending').length;

      const totalDays = attendance.length;
      const onTimeDays = attendance.filter((log: any) => log.status === 'On-Time').length;
      const rate = totalDays > 0 ? Math.round((onTimeDays / totalDays) * 100) : 100;

      const todayStr = new Date().toISOString().split('T')[0];
      const activeLog = attendance.find((log: any) => log.date === todayStr && !log.clockOut);
      const dayLog = attendance.find((log: any) => log.date === todayStr);

      setTodayLog(dayLog || null);
      setRecentLogs(attendance.slice(-5).reverse());

      setEmpStats({
        attendanceRate: `${rate}%`,
        daysPresent: `${totalDays} logs`,
        leaveBalance: `${30 - approvedLeaves} Days Left`,
        pendingLeaves: `${pendingCount} request${pendingCount !== 1 ? 's' : ''} pending`,
        deptName: dept ? dept.name : 'Unassigned',
        deptManager: dept ? `${dept.managerName} (Manager)` : 'Unassigned',
        isClockedIn: !!activeLog,
        clockInTime: activeLog ? activeLog.clockIn : null,
      });

      const activities: any[] = [];
      if (leaves.length > 0) {
        const lastLeave = leaves[leaves.length - 1];
        activities.push({
          id: 'l1',
          text: `Your ${lastLeave.leaveType} leave request is ${lastLeave.status.toLowerCase()}`,
          time: 'Request update',
          dot: lastLeave.status === 'Approved' ? 'bg-emerald-400' : lastLeave.status === 'Pending' ? 'bg-amber-400' : 'bg-red-400',
        });
      }
      if (attendance.length > 0) {
        const lastLog = attendance[attendance.length - 1];
        activities.push({
          id: 'a1',
          text: `You clocked in at ${lastLog.clockIn} (${lastLog.status})`,
          time: lastLog.date,
          dot: 'bg-cyan-400',
        });
      }
      activities.push({
        id: 'sys',
        text: 'Signed in successfully to HRMS portal',
        time: 'Just now',
        dot: 'bg-slate-500',
      });
      setRecentActivities(activities);
    } catch (error) {
      console.error('Employee dashboard data error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authAxios) fetchDashboardData();
  }, [authAxios]);

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
    if (empStats.isClockedIn && empStats.clockInTime) {
      const calculateElapsed = () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const clockInDate = new Date(`${todayStr}T${empStats.clockInTime}:00`);
        const now = new Date();
        const diffMs = now.getTime() - clockInDate.getTime();
        if (diffMs < 0) {
          setElapsedTime('00:00:00');
          return;
        }
        const secs = Math.floor((diffMs / 1000) % 60);
        const mins = Math.floor((diffMs / (1000 * 60)) % 60);
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
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [empStats.isClockedIn, empStats.clockInTime]);

  const handlePunch = async () => {
    const action = empStats.isClockedIn ? 'clock-out' : 'clock-in';
    try {
      const response = await authAxios.post('/api/attendance', { action });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchDashboardData();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Punch operation failed');
    }
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <EmployeeLayout>
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-violet-600/15 via-indigo-600/8 to-transparent p-6 mb-7">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -ml-16 -mb-16 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                Active Session
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {getGreeting()}, {user?.name}!
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Have a productive day at work. Here is your dashboard overview.
            </p>
          </div>
          <div className="text-right shrink-0 bg-white/5 border border-white/8 backdrop-blur-md rounded-xl px-4 py-2.5">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Today&apos;s Date
            </p>
            <p className="text-xs font-semibold text-slate-200 mt-0.5">{dateStr}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        <StatCard
          title="Session Timer"
          value={empStats.isClockedIn ? elapsedTime : 'Offline'}
          growth={empStats.isClockedIn ? `Clocked in at ${empStats.clockInTime}` : 'Not started today'}
          growthType={empStats.isClockedIn ? 'positive' : 'neutral'}
          icon={<Clock size={18} className="text-blue-400" />}
          iconBg="bg-blue-500/15 border border-blue-500/25"
          color=""
          accentColor="from-blue-500 to-blue-400"
        />
        <StatCard
          title="My Attendance"
          value={loading ? '...' : empStats.attendanceRate}
          growth={empStats.daysPresent}
          growthType="positive"
          icon={<Clock3 size={18} className="text-emerald-400" />}
          iconBg="bg-emerald-500/15 border border-emerald-500/25"
          color=""
          accentColor="from-emerald-500 to-teal-400"
        />
        <StatCard
          title="Leave Balance"
          value={loading ? '...' : empStats.leaveBalance}
          growth={empStats.pendingLeaves}
          growthType="warning"
          icon={<CalendarDays size={18} className="text-amber-400" />}
          iconBg="bg-amber-500/15 border border-amber-500/25"
          color=""
          accentColor="from-amber-500 to-orange-400"
        />
        <StatCard
          title="My Department"
          value={loading ? '...' : empStats.deptName}
          growth={empStats.deptManager}
          growthType="neutral"
          icon={<Building2 size={18} className="text-violet-400" />}
          iconBg="bg-violet-500/15 border border-violet-500/25"
          color=""
          accentColor="from-violet-500 to-indigo-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
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
                empStats.isClockedIn
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white border-red-500/30 shadow-red-900/20'
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-violet-500/30 shadow-violet-900/20'
              }`}
            >
              {empStats.isClockedIn ? (
                <><Square size={15} fill="white" /> Clock Out</>
              ) : (
                <><Play size={15} fill="white" /> Clock In</>
              )}
            </button>

            {empStats.isClockedIn && empStats.clockInTime && (
              <p className="text-[10px] text-slate-500 mt-3">
                Started at <span className="text-slate-300 font-bold">{empStats.clockInTime}</span>
              </p>
            )}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/[0.06] flex flex-col">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex gap-3 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-white/10 mt-1.5 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-white/5 rounded w-4/5" />
                    <div className="h-2.5 bg-white/5 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 flex-1 overflow-y-auto">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 pb-4 border-b border-white/[0.05] last:border-0 last:pb-0">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${act.dot}`} />
                  <div>
                    <p className="text-xs text-slate-300 leading-relaxed">{act.text}</p>
                    <span className="text-[10px] text-slate-600 font-medium uppercase tracking-wider mt-1 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5 border border-white/[0.06]">
        <div className="flex items-center gap-2 mb-4">
          <Clock3 className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-white">Today&apos;s Status</h3>
        </div>
        {loading ? (
          <div className="h-10 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : todayLog ? (
          <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center border border-violet-400/20 text-white font-bold text-xs uppercase">
                {user?.name?.slice(0, 2)}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{user?.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Clocked In at <span className="font-mono font-bold text-cyan-400">{todayLog.clockIn}</span>
                  {todayLog.clockOut && (
                    <> · Clocked Out at <span className="font-mono font-bold text-slate-400">{todayLog.clockOut}</span></>
                  )}
                </p>
              </div>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              todayLog.status === 'On-Time'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {todayLog.status}
            </span>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500">
            <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs">Not clocked in yet today</p>
          </div>
        )}
      </div>

    </EmployeeLayout>
  );
}
