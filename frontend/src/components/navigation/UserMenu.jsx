import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 rounded-full bg-white/5 hover:bg-white/15 transition-colors border border-white/10"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-500 text-white font-bold text-xs flex items-center justify-center border border-[#FF9933]">
          {user?.avatar || 'HP'}
        </div>
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold text-white leading-tight">{user?.name || 'H. Pandey'}</span>
          <span className="text-[9px] text-slate-400 leading-tight">{user?.role || 'ADMIN'}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 text-slate-800 z-50 animate-fadeIn overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
            <div className="text-xs font-bold">{user?.name || 'H. Pandey'}</div>
            <div className="text-[10px] text-slate-500">{user?.email || 'admin@mospi.gov.in'}</div>
          </div>
          <div className="py-1">
            <button
              onClick={() => {
                setOpen(false);
                navigate(ROUTES.PROFILE);
              }}
              className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <User className="w-3.5 h-3.5" /> Profile & Security
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
