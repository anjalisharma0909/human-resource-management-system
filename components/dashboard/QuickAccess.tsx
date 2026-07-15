'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Users, Building2, CalendarDays, Clock3, ArrowRight } from 'lucide-react';

export default function QuickAccess() {
  const { user } = useAuth();

  const allModules = [
    { title: 'Employees',         subtitle: 'Manage organization profiles',       icon: Users,       href: '/admin/employees',   roles: ['Admin','Manager'] },
    { title: 'Departments',       subtitle: 'Structure & budget allocations',     icon: Building2,   href: '/admin/departments', roles: ['Admin','Manager'] },
    { title: 'Leave Manager',     subtitle: 'Apply & approve requests',           icon: CalendarDays,href: '/admin/leave',        roles: ['Admin','Manager','Employee'] },
    { title: 'Attendance Tracker',subtitle: 'Punch check and active log tracker', icon: Clock3,      href: '/admin/attendance',  roles: ['Admin','Manager','Employee'] },
  ];

  const filteredModules = allModules.filter(m => user ? m.roles.includes(user.role) : false);

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>Quick Access</h2>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Jump to any module</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
        {filteredModules.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="saas-card-hover"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', textDecoration: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'var(--surface-hover)',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent)',
                }}>
                  <Icon size={16} />
                </div>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</p>
                  <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{item.subtitle}</p>
                </div>
              </div>
              <ArrowRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}