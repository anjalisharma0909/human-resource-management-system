'use client';

import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 12,
      }}>
        <span className="spinner" style={{ width: 24, height: 24, borderWidth: 2 }} />
        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowY: 'auto' }}>
        <Navbar />
        <main style={{ flex: 1, padding: '28px 32px' }} className="animate-slide-up">
          {children}
        </main>
      </div>
    </div>
  );
}