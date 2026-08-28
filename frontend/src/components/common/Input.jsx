import React from 'react';

export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-xs font-semibold text-slate-700">{label}</label>}
      <input
        className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-md outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933] transition-colors ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
