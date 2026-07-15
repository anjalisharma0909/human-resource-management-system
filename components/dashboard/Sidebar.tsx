'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  Clock3,
  User,
  LogOut,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = [
    { name: 'Dashboard',   href: '/admin/dashboard',   icon: LayoutDashboard, roles: ['Admin','Manager','Employee'] },
    { name: 'Employees',   href: '/admin/employees',   icon: Users,           roles: ['Admin','Manager'] },
    { name: 'Departments', href: '/admin/departments', icon: Building2,       roles: ['Admin','Manager'] },
    { name: 'Leave',       href: '/admin/leave',       icon: CalendarDays,    roles: ['Admin','Manager','Employee'] },
    { name: 'Attendance',  href: '/admin/attendance',  icon: Clock3,          roles: ['Admin','Manager','Employee'] },
    { name: 'Profile',     href: '/admin/profile',     icon: User,            roles: ['Admin','Manager','Employee'] },
  ];

  const filteredLinks = links.filter(l => user ? l.roles.includes(user.role) : false);

  return (
    <aside style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
      className="w-56 min-h-screen flex flex-col relative z-25">

      <div style={{ borderBottom: '1px solid var(--border)' }} className="px-5 py-4 flex items-center gap-2.5">
        <div style={{ background: 'var(--accent)', borderRadius: 8 }}
          className="w-7 h-7 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-xs">H</span>
        </div>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>
            HRMS
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 10.5, marginTop: 1 }}>
            {user?.organization || 'Admin Portal'}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredLinks.map(link => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '7px 10px',
                borderRadius: 7,
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--surface-hover)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.12s',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
            >
              <Icon
                size={15}
                style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0 }}
              />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div style={{ borderTop: '1px solid var(--border)', padding: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 4px', marginBottom: 6 }}>
          <img
            src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=5b6cf8&color=fff&size=64`}
            alt="avatar"
            style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }}
          />
          <div style={{ overflow: 'hidden' }}>
            <p style={{ color: 'var(--text-primary)', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 110 }}>
              {user?.name}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 1 }}>{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '7px 10px',
            borderRadius: 7, border: 'none',
            background: 'transparent',
            color: 'var(--danger)', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', transition: 'background 0.12s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--danger-subtle)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}