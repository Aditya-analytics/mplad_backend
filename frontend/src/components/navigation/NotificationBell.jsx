import React, { useState } from 'react';
import { Bell, AlertCircle, Clock, CheckCircle } from 'lucide-react';

export function NotificationBell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0A192F]" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 text-slate-800 z-50 animate-fadeIn">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
            <span className="font-bold text-xs">Notifications</span>
            <span className="text-[10px] text-red-600 font-semibold cursor-pointer">Mark all read</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
            <div className="p-3 flex gap-2.5 hover:bg-slate-50 cursor-pointer">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold">Critical Anomaly Flagged</div>
                <div className="text-[10px] text-slate-500">Pune · Duplicate asset flags triggered</div>
              </div>
            </div>
            <div className="p-3 flex gap-2.5 hover:bg-slate-50 cursor-pointer">
              <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold">Delay Threshold Exceeded</div>
                <div className="text-[10px] text-slate-500">Lucknow · Hospital delayed by 74 days</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
