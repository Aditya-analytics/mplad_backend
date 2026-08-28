import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export function Sidebar({ onToggleCollapse, onCloseMobile }) {
  const location = useLocation();

  const navSections = [
    {
      category: 'Main Dashboard',
      items: [
        { label: 'Overview', path: ROUTES.DASHBOARD, icon: 'fa-chart-pie' },
        { label: 'Works Monitoring', path: ROUTES.PROJECTS, icon: 'fa-list-check' },
      ],
    },
    {
      category: 'Intelligence & Analytics',
      items: [
        { label: 'Duplicate Radar (NLP)', path: ROUTES.ANOMALIES_DUPLICATES, icon: 'fa-copy', badge: 'HIGH' },
        { label: 'Cost Outliers (ML)', path: ROUTES.ANOMALIES_COSTS, icon: 'fa-money-bill-wave' },
        { label: 'Delay Predictor', path: ROUTES.ANOMALIES_DELAYS, icon: 'fa-clock-rotate-left' },
        { label: 'Compliance Audit', path: ROUTES.ANOMALIES_COMPLIANCE, icon: 'fa-scale-balanced', badge: 'CRITICAL' },
        { label: 'Financial Analytics', path: ROUTES.ANALYTICS, icon: 'fa-chart-line' },
        { label: 'Alert Center', path: ROUTES.ALERTS, icon: 'fa-bell', badge: '3' },
      ],
    },
    {
      category: 'Governance',
      items: [
        { label: 'Report Generator', path: ROUTES.REPORTS, icon: 'fa-file-invoice' },
        { label: 'Settings & Profile', path: ROUTES.PROFILE, icon: 'fa-user-shield' },
      ],
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title-wrapper">
          <i className="fa-solid fa-shield-halved sidebar-logo"></i>
          <span className="sidebar-title">MPLADS AI</span>
        </div>
        <button
          className="sidebar-toggle-btn"
          id="sidebarToggleBtn"
          title="Toggle Sidebar"
          onClick={onToggleCollapse}
        >
          <i className="fa-solid fa-bars-staggered"></i>
        </button>
      </div>

      <nav className="sidebar-nav">
        {navSections.map((sec) => (
          <React.Fragment key={sec.category}>
            <div className="nav-category">{sec.category}</div>
            {sec.items.map((item) => {
              const isBaseActive = location.pathname === item.path || (item.path.includes('#') && location.pathname === item.path.split('#')[0] && location.hash === `#${item.path.split('#')[1]}`);
              return (
                <NavLink
                  key={item.label + item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `nav-item ${isActive || isBaseActive ? 'active' : ''}`
                  }
                >
                  <i className={`fa-solid ${item.icon}`}></i>
                  <span className="nav-text">{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </NavLink>
              );
            })}
          </React.Fragment>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span>SIH 2026 PROTOTYPE v2.4</span>
      </div>
    </aside>
  );
}

export default Sidebar;
