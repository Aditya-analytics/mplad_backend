import React from 'react';
import { Filter } from 'lucide-react';
import { Select } from './Select';

export function FilterPanel({ filters = [], values = {}, onChange }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <Filter className="w-3.5 h-3.5" /> Filters:
      </div>
      {filters.map((f) => (
        <Select
          key={f.key}
          options={f.options}
          value={values[f.key] || 'ALL'}
          onChange={(e) => onChange(f.key, e.target.value)}
          className="text-xs py-1.5"
        />
      ))}
    </div>
  );
}
