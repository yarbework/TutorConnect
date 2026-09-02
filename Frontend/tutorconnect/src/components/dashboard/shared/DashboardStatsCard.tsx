import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
}

export default function DashboardStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  bgColor,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
      </div>
      <div className={`p-3.5 rounded-2xl ${bgColor} ${iconColor} shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}