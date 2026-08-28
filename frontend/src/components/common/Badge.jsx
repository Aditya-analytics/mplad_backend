import React from 'react';

export function Badge({ children, variant = 'info', className = '' }) {
  const variants = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    moderate: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    info: 'bg-sky-100 text-sky-700 border-sky-200',
    navy: 'bg-slate-800 text-white border-slate-900',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${variants[variant] || variants.info} ${className}`}>
      {children}
    </span>
  );
}
