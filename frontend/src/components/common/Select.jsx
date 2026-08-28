import React from 'react';

export function Select({ label, options = [], className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-semibold text-slate-700">{label}</label>}
      <select
        className={`px-3 py-2 text-sm border border-slate-200 rounded-md outline-none bg-white focus:border-[#FF9933] cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
