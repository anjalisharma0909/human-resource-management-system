'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import EmployeeLayout from '@/components/employee/EmployeeLayout';
import { User, Phone, Mail, Building, Lock, Save, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

const avatarTemplates = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&fit=crop',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&h=256&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&fit=crop',
];

export default function EmployeeProfilePage() {
  const { user, authAxios, refreshAccessToken } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Full name is required');
      return;
    }

    setIsSavingProfile(true);
    try {
      toast.success('Profile updated successfully!');
      await refreshAccessToken();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile details');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await authAxios.post('/api/auth/change-password', {
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        toast.success('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Failed to change password';
      toast.error(errorMsg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <EmployeeLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Profile Settings
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">Manage your personal details and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/5 text-center flex flex-col items-center">
            <div className="relative group mb-4">
              <img
                src={avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&h=256&fit=crop'}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-violet-500/50 shadow-lg shadow-violet-900/10"
              />
            </div>
            
            <h3 className="text-base font-bold text-white leading-normal">{user?.name}</h3>
            <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mt-0.5">{user?.role}</p>
            <p className="text-[10px] text-slate-500 font-medium mt-1">{user?.email}</p>

            <div className="border-t border-white/5 pt-5 mt-5 w-full">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Choose Avatar</p>
              <div className="grid grid-cols-6 gap-2">
                {avatarTemplates.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-8 h-8 rounded-full overflow-hidden border cursor-pointer hover:scale-105 active:scale-95 transition-all ${
                      avatarUrl === url ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-white/10'
                    }`}
                  >
                    <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-5">
              <User className="w-5 h-5 text-violet-400" />
              <h3 className="text-sm font-bold text-white">Personal Information</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 rounded-xl glass-input text-xs"
                      placeholder="Rahul Sharma"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address (Primary)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-10 pr-3 py-2 rounded-xl glass-input text-xs opacity-50 cursor-not-allowed bg-white/1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 rounded-xl glass-input text-xs"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Organization</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                      <Building className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={user?.organization || 'Acme Corp'}
                      disabled
                      className="w-full pl-10 pr-3 py-2 rounded-xl glass-input text-xs opacity-50 cursor-not-allowed bg-white/1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl shadow-lg border border-violet-500/30 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  {isSavingProfile ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save size={13} />
                      Save Details
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-5">
              <KeyRound className="w-5 h-5 text-violet-400" />
              <h3 className="text-sm font-bold text-white">Security & Password</h3>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Current Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">New Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl shadow-lg border border-violet-500/30 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  {isChangingPassword ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Lock size={13} />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
