'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Bell, Search, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 20,
    }}>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>
        {today}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ position: 'relative' }} className="hidden md:block">
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search..."
            className="saas-input"
            style={{ paddingLeft: 32, width: 200, fontSize: 13 }}
          />
        </div>

        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(v => !v)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '6px 8px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'border-color 0.12s',
            }}
          >
            <Bell size={15} />
          </button>

          {showNotifications && (
            <div
              className="animate-slide-up"
              style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                width: 280, background: 'var(--surface)',
                border: '1px solid var(--border)', borderRadius: 10,
                padding: 16, zIndex: 50,
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
              }}
            >
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Notifications</p>
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                No new notifications
              </div>
            </div>
          )}
        </div>

        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

        <Link
          href="/admin/profile"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '5px 10px', borderRadius: 8,
            textDecoration: 'none',
            border: '1px solid transparent',
            transition: 'border-color 0.12s, background 0.12s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--surface-hover)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
          }}
        >
          <img
            src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=5b6cf8&color=fff&size=64`}
            alt="avatar"
            style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }}
          />
          <div className="hidden sm:block">
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {user?.name}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.2 }}>{user?.role}</p>
          </div>
          <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} className="hidden sm:block" />
        </Link>
      </div>
    </header>
  );
}