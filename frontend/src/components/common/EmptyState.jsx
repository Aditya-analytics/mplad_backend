import React from 'react';
import { Inbox } from 'lucide-react';

export function EmptyState({ title = 'No Records Found', description = 'Adjust your search filters or try broadening your criteria.' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
      <Inbox className="w-12 h-12 text-slate-300 mb-2" />
      <h4 className="font-bold text-slate-700 text-sm">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1">{description}</p>
    </div>
  );
}
