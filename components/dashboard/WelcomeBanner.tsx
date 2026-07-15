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

  return (
    <div style={{
      display: 'flex', flexDirection: 'row', alignItems: 'center',
      justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      padding: '18px 22px', marginBottom: 24,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 10,
    }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
          {user?.role} Portal
        </p>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 4 }}>
          Welcome back, {user?.name?.split(' ')[0] || 'User'}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {subtitles[user?.role || ''] || ''}
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {user?.role === 'Admin' && (
          <>
            <Link href="/admin/employees" className="btn-primary" style={{ textDecoration: 'none' }}>
              <UserPlus size={13} /> Add Employee
            </Link>
            <button onClick={handleGenerateReport} className="btn-secondary">
              <FileText size={13} /> Export Report
            </button>
          </>
        )}
        {user?.role === 'Manager' && (
          <>
            <Link href="/admin/leave" className="btn-primary" style={{ textDecoration: 'none' }}>
              <CalendarDays size={13} /> Review Leaves
            </Link>
            <button onClick={handleGenerateReport} className="btn-secondary">
              <FileText size={13} /> Export Report
            </button>
          </>
        )}
        {user?.role === 'Employee' && (
          <>
            <Link href="/admin/attendance" className="btn-primary" style={{ textDecoration: 'none' }}>
              <Clock3 size={13} /> Punch In
            </Link>
            <Link href="/admin/leave" className="btn-secondary" style={{ textDecoration: 'none' }}>
              <CalendarDays size={13} /> Apply Leave
            </Link>
          </>
        )}
      </div>
    </div>
  );
}