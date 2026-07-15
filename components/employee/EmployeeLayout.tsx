'use client';

import EmployeeSidebar from './EmployeeSidebar';
import EmployeeNavbar from './EmployeeNavbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#080612] flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">Loading Portal...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#080612] text-slate-100 overflow-hidden relative">
      <div className="glow-blob glow-purple w-[600px] h-[600px] -top-96 -left-48 opacity-35 animate-pulse-glow"></div>
      <div className="glow-blob glow-cyan w-[600px] h-[600px] -bottom-96 -right-48 opacity-25 animate-pulse-glow" style={{ animationDelay: '-4s' }}></div>

      <EmployeeSidebar />

      <div className="flex-1 flex flex-col min-h-screen relative z-10 overflow-y-auto">
        <EmployeeNavbar />

        <main className="p-8 flex-1 animate-slide-up">
          {children}
        </main>
      </div>
    </div>
  );
}
