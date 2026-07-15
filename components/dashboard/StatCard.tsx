import { ReactNode } from 'react';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  iconBg: string;
  growth: string;
  growthType?: 'positive' | 'neutral' | 'warning';
  accentColor?: string;
};

export default function StatCard({ title, value, icon, growth, growthType = 'neutral' }: StatCardProps) {
  const growthColor = {
    positive: 'var(--success)',
    neutral: 'var(--text-muted)',
    warning: 'var(--warning)',
  }[growthType];

  return (
    <div
      className="saas-card-hover"
      style={{ padding: '18px 20px' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.01em', textTransform: 'uppercase' }}>
          {title}
        </p>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--surface-hover)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-secondary)',
        }}>
          {icon}
        </div>
      </div>

      <p style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 10 }}>
        {value}
      </p>

      <p style={{ fontSize: 12, color: growthColor, fontWeight: 500 }}>
        {growth}
      </p>
    </div>
  );
}