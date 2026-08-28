import React from 'react';
import { FolderCheck, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROUTES } from '../../constants/routes';

export function RecentProjects({ projects = [] }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm text-[#0A192F] font-['Outfit'] flex items-center gap-2">
          <FolderCheck className="w-4 h-4 text-[#FF9933]" /> Works Under Monitoring
        </h3>
        <button
          onClick={() => navigate(ROUTES.PROJECTS)}
          className="text-xs text-[#0A192F] hover:text-[#FF9933] font-semibold flex items-center gap-1"
        >
          View Master List <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {projects.slice(0, 4).map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/app/projects/${p.id}`)}
            className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded transition-all cursor-pointer"
          >
            <div>
              <div className="text-xs font-bold text-[#0A192F]">{p.projectName}</div>
              <div className="text-[11px] text-slate-500">{p.id} · {p.district}, {p.state}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-800">{formatCurrency(p.sanctionedAmount)}</div>
              <Badge variant={p.riskLevel.toLowerCase()}>{p.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
