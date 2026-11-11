import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  color = '#6955E8',
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`admin-card relative overflow-hidden flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-admin-primary/40' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-admin-muted">
            {title}
          </span>
          <div className="mt-1 text-2xl font-black text-admin-text tracking-tight">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
        </div>

        {Icon && (
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm"
            style={{ backgroundColor: `${color}15`, color }}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
          {trend && (
            <span
              className={`flex items-center gap-1 font-bold ${
                trendPositive ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {trendPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {trend}
            </span>
          )}
          {subtitle && <span className="text-admin-muted text-[11px] truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
