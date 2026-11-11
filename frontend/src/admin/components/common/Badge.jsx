import React from 'react';

const BADGE_STYLES = {
  // Statuses
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  'under review': 'bg-blue-50 text-blue-700 border-blue-200',
  'needs changes': 'bg-amber-50 text-amber-700 border-amber-200',
  draft: 'bg-slate-100 text-slate-700 border-slate-200',
  
  inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  archived: 'bg-slate-100 text-slate-600 border-slate-200',
  suspended: 'bg-red-50 text-red-700 border-red-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  withdrawn: 'bg-red-50 text-red-700 border-red-200',
  expired: 'bg-slate-100 text-slate-500 border-slate-200',

  // Levels & Difficulties
  easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  hard: 'bg-red-50 text-red-700 border-red-200',

  // Priority
  high: 'bg-red-50 text-red-700 border-red-200',
  urgent: 'bg-red-50 text-red-700 border-red-200',
  normal: 'bg-blue-50 text-blue-700 border-blue-200',
  low: 'bg-slate-100 text-slate-600 border-slate-200',

  // Default brand
  brand: 'bg-admin-primary/10 text-admin-primary border-admin-primary/20',
};

export default function Badge({ children, variant, className = '' }) {
  const key = (variant || String(children || '')).toLowerCase();
  const matchedStyle = BADGE_STYLES[key] || BADGE_STYLES.brand;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition ${matchedStyle} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
}
