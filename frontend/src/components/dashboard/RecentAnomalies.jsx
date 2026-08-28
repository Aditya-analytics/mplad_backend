import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { ROUTES } from '../../constants/routes';

export function RecentAnomalies({ anomalies = [] }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm text-[#0A192F] font-['Outfit'] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" /> Recent AI Anomaly Alerts
        </h3>
        <button
          onClick={() => navigate(ROUTES.ANOMALIES)}
          className="text-xs text-[#0A192F] hover:text-[#FF9933] font-semibold flex items-center gap-1"
        >
          View All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {anomalies.map((a) => (
          <div
            key={a.id}
            onClick={() => navigate(`/app/anomalies/${a.id}`)}
            className="p-3 border border-slate-100 rounded-lg hover:border-amber-300 hover:bg-amber-50/40 transition-all cursor-pointer flex items-start justify-between gap-3"
          >
            <div>
              <div className="text-xs font-bold text-[#0A192F]">{a.projectName}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{a.location} · {a.type}</div>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">{a.explanation}</p>
            </div>
            <Badge variant={a.severity.toLowerCase()}>{a.riskScore}/100</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
