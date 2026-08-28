import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x && x !== 'app');

  return (
    <nav className="flex items-center text-xs text-slate-500 mb-4 gap-1">
      <Link to="/app/dashboard" className="hover:text-[#0A192F] flex items-center gap-1">
        <Home className="w-3 h-3" /> Dashboard
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/app/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return (
          <React.Fragment key={name}>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            {isLast ? (
              <span className="font-semibold text-[#0A192F] capitalize">{name}</span>
            ) : (
              <Link to={routeTo} className="hover:text-[#0A192F] capitalize">
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
