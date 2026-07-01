'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import QuickAccess from '@/components/dashboard/QuickAccess';
import {
  Users,
  Building2,
  CalendarDays,
  Clock3,
  Activity,
  UserCheck,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { authAxios, user } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    departments: 0,
    pendingLeaves: 0,
    presentToday: 0,
    totalToday: 0,
    onTimeToday: 0,
    lateToday: 0,
  });

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

  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
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

        if (user?.role === 'Employee') {
          const selfEmp = employees[0];
          const dept = departments.find((d: any) => d.id === selfEmp?.departmentId);
          const personalLeaves = leaves;
          const personalAttendance = attendance;

          const approvedLeaves = personalLeaves.filter((l: any) => l.status === 'Approved').length;
          const pendingCount = personalLeaves.filter((l: any) => l.status === 'Pending').length;

          const totalDays = personalAttendance.length;
          const onTimeDays = personalAttendance.filter((log: any) => log.status === 'On-Time').length;
          const rate = totalDays > 0 ? Math.round((onTimeDays / totalDays) * 100) : 100;

          const todayStr = new Date().toISOString().split('T')[0];
          const activeLog = personalAttendance.find((log: any) => log.date === todayStr && !log.clockOut);

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
          if (personalLeaves.length > 0) {
            const lastLeave = personalLeaves[personalLeaves.length - 1];
            activities.push({
              id: 'l1',
              text: `Your ${lastLeave.leaveType} leave request is ${lastLeave.status.toLowerCase()}`,
              time: 'Request update',
              dot: lastLeave.status === 'Approved' ? 'bg-emerald-400' : lastLeave.status === 'Pending' ? 'bg-amber-400' : 'bg-red-400',
            });
          }
          if (personalAttendance.length > 0) {
            const lastLog = personalAttendance[personalAttendance.length - 1];
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
        } else {
          const pendingCount = leaves.filter((l: any) => l.status === 'Pending').length;
          const todayStr = new Date().toISOString().split('T')[0];
          const todayLogs = attendance.filter((log: any) => log.date === todayStr);
          const presentCount = todayLogs.length;
          const lateCount = todayLogs.filter((log: any) => log.status === 'Late').length;
          const onTimeCount = presentCount - lateCount;

          setStats({
            totalEmployees: employees.length,
            departments: departments.length,
            pendingLeaves: pendingCount,
            presentToday: presentCount,
            totalToday: employees.length,
            onTimeToday: onTimeCount,
            lateToday: lateCount,
          });

          setTodayAttendance(todayLogs);

          const activities: any[] = [];
          if (leaves.length > 0) {
            const recentLeave = leaves[leaves.length - 1];
            activities.push({
              id: 'act1',
              icon: Calendar,
              text: `${recentLeave.employeeName} submitted a ${recentLeave.leaveType} leave request`,
              time: '1 hour ago',
              dot: 'bg-amber-400',
            });
          }
          if (attendance.length > 0) {
            const recentPunch = attendance[attendance.length - 1];
            activities.push({
              id: 'act2',
              icon: Clock3,
              text: `${recentPunch.employeeName} clocked in at ${recentPunch.clockIn} (${recentPunch.status})`,
              time: 'Today',
              dot: 'bg-cyan-400',
            });
          }
          if (employees.length > 0) {
            const recentEmp = employees[employees.length - 1];
            activities.push({
              id: 'act3',
              icon: UserCheck,
              text: `${recentEmp.name} joined as ${recentEmp.role}`,
              time: recentEmp.joinDate,
              dot: 'bg-emerald-400',
            });
          }
          activities.push({
            id: 'act4',
            icon: Briefcase,
            text: 'System backup completed successfully',
            time: 'Yesterday',
            dot: 'bg-slate-500',
          });
          setRecentActivities(activities);
        }
      } catch (error) {
        console.error('Dashboard data error:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    if (authAxios) fetchDashboardData();
  }, [authAxios, user]);

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

  const attendanceDisplay = (() => {
    if (loading) return '...';
    return `${stats.presentToday} / ${stats.totalToday}`;
  })();

  const attendanceGrowth = (() => {
    if (loading) return '—';
    return `On-Time: ${stats.onTimeToday} · Late: ${stats.lateToday}`;
  })();

  return (
    <DashboardLayout>
      <WelcomeBanner />

      {user?.role === 'Employee' ? (
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
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
          <StatCard
            title="Total Employees"
            value={loading ? '...' : stats.totalEmployees}
            growth="+12% this month"
            growthType="positive"
            icon={<Users size={18} className="text-blue-400" />}
            iconBg="bg-blue-500/15 border border-blue-500/25"
            color=""
            accentColor="from-blue-500 to-blue-400"
          />
          <StatCard
            title="Departments"
            value={loading ? '...' : stats.departments}
            growth="Active units"
            growthType="neutral"
            icon={<Building2 size={18} className="text-emerald-400" />}
            iconBg="bg-emerald-500/15 border border-emerald-500/25"
            color=""
            accentColor="from-emerald-500 to-teal-400"
          />
          <StatCard
            title="Pending Leaves"
            value={loading ? '...' : stats.pendingLeaves}
            growth={stats.pendingLeaves > 0 ? 'Needs review' : 'All clear'}
            growthType={stats.pendingLeaves > 0 ? 'warning' : 'positive'}
            icon={<CalendarDays size={18} className="text-amber-400" />}
            iconBg="bg-amber-500/15 border border-amber-500/25"
            color=""
            accentColor="from-amber-500 to-orange-400"
          />
          <StatCard
            title="Today's Attendance"
            value={attendanceDisplay}
            growth={attendanceGrowth}
            growthType={stats.lateToday > 0 ? 'warning' : 'positive'}
            icon={<Clock3 size={18} className="text-violet-400" />}
            iconBg="bg-violet-500/15 border border-violet-500/25"
            color=""
            accentColor="from-violet-500 to-indigo-400"
          />
        </div>
      )}

      {user?.role !== 'Employee' && todayAttendance.length > 0 && (
        <div className="glass-panel rounded-2xl border border-white/[0.06] overflow-hidden mb-5">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock3 className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-bold text-white">Today&apos;s Attendance Overview</h3>
              <span className="text-[10px] bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full px-2 py-0.5 font-bold">
                {todayAttendance.length}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 size={12} />
                {stats.onTimeToday} On-Time
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <AlertTriangle size={12} />
                {stats.lateToday} Late
              </span>
            </div>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {todayAttendance.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-violet-300">
                      {log.employeeName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{log.employeeName}</p>
                    <p className="text-[10px] text-slate-500">Clocked in at <span className="text-cyan-400 font-mono font-bold">{log.clockIn}</span></p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  log.status === 'On-Time'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <QuickAccess />
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/[0.06] flex flex-col">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((n) => (
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
    </DashboardLayout>
  );
}