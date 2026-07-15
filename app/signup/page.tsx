'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Briefcase, Building2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!adminName.trim()) e.adminName = 'Full name is required';
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!department.trim()) e.department = 'Department is required';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'At least 6 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const names = adminName.trim().split(' ');
      const first_name = names[0];
      const last_name = names.length > 1 ? names.slice(1).join(' ') : 'Admin';
      const response = await axios.post('/api/v1/auth/signup', { first_name, last_name, email, password, role: 'Admin', department_name: department });
      if (response.data.message) {
        toast.success('Account created! Please sign in.');
        router.push('/login');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: '24px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: 380 }} className="animate-slide-up">

        <Link
          href="/login"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none',
            marginBottom: 24, fontWeight: 500,
          }}
        >
          <ArrowLeft size={14} /> Back to login
        </Link>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent), #7a5af8)', margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(79, 142, 247, 0.25)', border: '1px solid var(--accent-border)'
          }}>
            <Briefcase size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Create Admin Account
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
            Set up access for your organization
          </p>
        </div>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '28px 28px',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)}
                  placeholder="John Doe" className="saas-input"
                  style={{ paddingLeft: 34, borderColor: errors.adminName ? 'var(--danger)' : undefined }}
                />
              </div>
              {errors.adminName && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 5 }}>{errors.adminName}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com" className="saas-input"
                  style={{ paddingLeft: 34, borderColor: errors.email ? 'var(--danger)' : undefined }}
                />
              </div>
              {errors.email && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 5 }}>{errors.email}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Department</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <select
                  value={department} onChange={(e) => setDepartment(e.target.value)}
                  className="saas-input"
                  style={{ paddingLeft: 34, borderColor: errors.department ? 'var(--danger)' : undefined, appearance: 'none' }}
                >
                  <option value="" disabled>Select Department</option>
                  <option value="HR">Human Resources</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
              {errors.department && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 5 }}>{errors.department}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters" className="saas-input"
                  style={{ paddingLeft: 34, paddingRight: 38, borderColor: errors.password ? 'var(--danger)' : undefined }}
                />
                <button
                  type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 5 }}>{errors.password}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password" className="saas-input"
                  style={{ paddingLeft: 34, borderColor: errors.confirmPassword ? 'var(--danger)' : undefined }}
                />
              </div>
              {errors.confirmPassword && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 5 }}>{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit" disabled={isSubmitting} className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '10px 18px', fontSize: 14, opacity: isSubmitting ? 0.7 : 1, marginTop: 4 }}
            >
              {isSubmitting ? <span className="spinner" /> : <>Create Account <ArrowRight size={14} /></>}
            </button>
          </form>

          <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}