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

export default function StatCard({
  title,
  value,
  icon,
  iconBg,
  growth,
  growthType = 'neutral',
  accentColor = 'from-violet-500 to-indigo-500',
}: StatCardProps) {
  const growthColors = {
    positive: 'text-emerald-400',
    neutral:  'text-slate-500',
    warning:  'text-amber-400',
  };

  const dotColors = {
    positive: 'bg-emerald-400',
    neutral:  'bg-slate-500',
    warning:  'bg-amber-400',
  };

  return (
    <div className="relative glass-panel rounded-2xl p-5 overflow-hidden group border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
      
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${accentColor} opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-start justify-between mb-4">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
      </div>

      <h2 className="text-3xl font-extrabold text-white tracking-tight leading-none mb-3">
        {value}
      </h2>

      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[growthType]}`} />
        <span className={`text-[11px] font-medium ${growthColors[growthType]}`}>
          {growth}
        </span>
      </div>
    </div>
  );
}