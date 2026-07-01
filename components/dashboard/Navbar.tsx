'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Bell, Search, ShieldCheck, ChevronDown, UserCircle, Calendar, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const [notifications, setNotifications] = useState<any[]>([]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="glass-panel border-0 border-b border-white/5 px-8 py-4 flex items-center justify-between relative z-20">
      
      <div>
        <p className="text-slate-400 text-sm font-semibold">
          {today}
        </p>
      </div>

      <div className="flex items-center gap-6">
        
        {pathname === '/admin/dashboard' && (
          <div className="relative hidden md:block">
            <Search
              className="absolute left-4 top-3 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-72 rounded-xl pl-11 pr-4 py-2.5 glass-input text-sm"
            />
          </div>
        )}

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer outline-none border border-transparent ${
              showNotifications ? 'bg-white/5 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
               <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-cyan-500 text-slate-900 text-[10px] font-bold flex items-center justify-center border border-[#080612]">
                 {unreadCount}
               </span>
             )}
           </button>
 
           {showNotifications && (
             <div className="absolute right-0 mt-3 w-80 rounded-2xl glass-panel border border-white/[0.08] shadow-2xl p-4 z-50 animate-slide-up">
               <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
                 <h4 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h4>
                 {unreadCount > 0 && (
                   <button
                     onClick={markAllRead}
                     className="text-[10px] font-bold text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
                   >
                     Mark all read
                   </button>
                 )}
               </div>
 
               <div className="space-y-2 max-h-64 overflow-y-auto">
                 {notifications.length === 0 ? (
                   <div className="py-6 text-center text-slate-500 text-xs">
                     No new notifications
                   </div>
                 ) : (
                   notifications.map((notif) => {
                     const IconComponent = notif.icon === 'Calendar' ? Calendar : Clock;
                     return (
                       <div
                         key={notif.id}
                         className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all ${
                           notif.unread
                             ? 'bg-white/[0.03] border-white/5'
                             : 'bg-transparent border-transparent opacity-60'
                         }`}
                       >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${notif.iconColor}`}>
                          <IconComponent size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{notif.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{notif.description}</p>
                          <span className="text-[9px] text-slate-600 font-medium block mt-1">{notif.time}</span>
                        </div>
                        {notif.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

        <Link href="/admin/profile" className="flex items-center gap-3 hover:bg-white/5 px-3 py-1.5 rounded-xl transition-all border border-transparent hover:border-white/5 cursor-pointer">
          {user?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt="User profile"
              className="w-8 h-8 rounded-full object-cover border border-white/20"
            />
          ) : (
            <UserCircle size={32} className="text-slate-400" />
          )}
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-white truncate max-w-[120px]">
              {user?.name}
            </p>
            <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
              {user?.role}
            </p>
          </div>
          <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
        </Link>
      </div>
    </header>
  );
}