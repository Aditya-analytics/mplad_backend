import React from 'react';
import { Badge } from '../common/Badge';

export function RiskScoreCard({ score = 72 }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
      <h3 className="font-bold text-sm text-[#0A192F] mb-3 font-['Outfit']">National AI Risk Score</h3>
      <div className="relative w-36 h-36 rounded-full flex items-center justify-center bg-gradient-to-tr from-red-600 via-amber-500 to-emerald-500 p-3 shadow-md">
        <div className="w-full h-full bg-white rounded-full flex flex-col items-center justify-center">
          <span className="font-['Outfit'] text-3xl font-extrabold text-[#0A192F]">{score}</span>
          <span className="text-[10px] text-slate-400 font-semibold">/ 100 INDEX</span>
        </div>
      </div>
      <div className="mt-4">
        <Badge variant="critical">HIGH COMPLIANCE RISK</Badge>
      </div>
      <p className="text-[11px] text-slate-500 mt-2">
        Composite score based on expenditure anomalies, schedule delays & duplicate asset signals.
      </p>
    </div>
  );
}
