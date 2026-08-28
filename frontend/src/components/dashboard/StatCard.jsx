import React from 'react';

export function StatCard({ icon: Icon, title, value, subtext, trend, color = 'navy' }) {
  const iconColors = {
    navy: 'bg-[#0A192F]/10 text-[#0A192F]',
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColors[color]}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        {trend && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              trend.type === 'up' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
      <div className="font-['Outfit'] text-2xl font-extrabold text-[#0A192F]">{value}</div>
      <div className="text-xs font-medium text-slate-500 mt-0.5">{title}</div>
      {subtext && <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">{subtext}</div>}
    </div>
  );
}
