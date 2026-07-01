'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import EmployeeLayout from '@/components/employee/EmployeeLayout';
import { CalendarDays, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'Sick' | 'Casual' | 'Annual';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestDate: string;
  reviewedBy?: string;
}

export default function EmployeeLeavePage() {
  const { authAxios } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [leaveType, setLeaveType] = useState<'Sick' | 'Casual' | 'Annual'>('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [balances, setBalances] = useState({
    Sick: { used: 0, total: 10 },
    Casual: { used: 0, total: 8 },
    Annual: { used: 0, total: 20 },
  });

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await authAxios.get('/api/leave');
      if (response.data.success) {
        const data = response.data.leaveRequests;
        setRequests(data);

        const approved = data.filter((r: LeaveRequest) => r.status === 'Approved');
        const balancesCopy = {
          Sick: { used: 0, total: 10 },
          Casual: { used: 0, total: 8 },
          Annual: { used: 0, total: 20 },
        };

        approved.forEach((req: LeaveRequest) => {
          const start = new Date(req.startDate);
          const end = new Date(req.endDate);
          const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
          if (req.leaveType in balancesCopy) {
            balancesCopy[req.leaveType].used += diffDays;
          }
        });

        setBalances(balancesCopy);
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authAxios) {
      fetchLeaveRequests();
    }
  }, [authAxios]);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      toast.error('All leave application fields are required');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Start date cannot be after end date');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authAxios.post('/api/leave', {
        leaveType,
        startDate,
        endDate,
        reason,
      });

      if (response.data.success) {
        toast.success('Leave application submitted successfully');
        setStartDate('');
        setEndDate('');
        setReason('');
        fetchLeaveRequests();
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Failed to submit leave request';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EmployeeLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Leave Management
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">
          Submit leave requests and review balances
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6 animate-slide-up">
          <div className="grid grid-cols-3 gap-3">
            {(['Sick', 'Casual', 'Annual'] as const).map((type) => {
              const bal = balances[type];
              const available = Math.max(0, bal.total - bal.used);
              return (
                <div key={type} className="glass-panel rounded-2xl p-4 border border-white/5 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{type}</p>
                  <p className="text-xl font-extrabold text-white mt-1.5">{available}</p>
                  <p className="text-[9px] text-slate-500 font-medium mt-1">/{bal.total} total days</p>
                </div>
              );
            })}
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Send className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-bold text-white">Apply for Leave</h3>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl glass-select text-xs outline-none"
                >
                  <option value="Annual">Annual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Casual">Casual Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Reason for Leave</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide details..."
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg border border-violet-500/30 transition-all active:scale-95 text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Submit Application'
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/5">
            <h3 className="text-sm font-bold text-white mb-4">My Leave Applications</h3>
            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : requests.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                <CalendarDays size={32} className="mx-auto text-slate-600 mb-2" />
                No leave requests submitted yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3 pr-4">ID</th>
                      <th className="pb-3 pr-4">Type</th>
                      <th className="pb-3 pr-4">Dates</th>
                      <th className="pb-3 pr-4">Reason</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {requests.map((r) => (
                      <tr key={r.id} className="text-slate-300 hover:bg-white/1 transition-colors">
                        <td className="py-3 pr-4 font-mono font-bold text-slate-500">{r.id}</td>
                        <td className="py-3 pr-4 font-bold text-white">{r.leaveType}</td>
                        <td className="py-3 pr-4 font-medium text-slate-400">
                          {r.startDate} to {r.endDate}
                        </td>
                        <td className="py-3 pr-4 truncate max-w-[150px]" title={r.reason}>{r.reason}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              r.status === 'Approved'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : r.status === 'Rejected'
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {r.status}
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
    </EmployeeLayout>
  );
}
