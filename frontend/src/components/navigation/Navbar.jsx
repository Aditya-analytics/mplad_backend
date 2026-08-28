import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { ROUTES } from '../../constants/routes';

export function Navbar({ onToggleSidebar, onSelectWork, onOpenLogoutModal }) {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  const searchContainerRef = useRef(null);
  const notifContainerRef = useRef(null);
  const adminContainerRef = useRef(null);

  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const q = searchValue.toLowerCase();
    const matches = projects.filter(
      (p) =>
        (p.projectName && p.projectName.toLowerCase().includes(q)) ||
        (p.id && p.id.toLowerCase().includes(q)) ||
        (p.district && p.district.toLowerCase().includes(q)) ||
        (p.state && p.state.toLowerCase().includes(q))
    ).slice(0, 6);

    setSearchResults(matches);
    setShowSearchDropdown(true);
  }, [searchValue, projects]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (notifContainerRef.current && !notifContainerRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
      if (adminContainerRef.current && !adminContainerRef.current.contains(e.target)) {
        setShowAdminDropdown(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSelectSearchResult = (p) => {
    setShowSearchDropdown(false);
    setSearchValue('');
    if (onSelectWork) {
      onSelectWork(p);
    } else {
      navigate(`/app/projects/${p.id}`);
    }
  };

  return (
    <header className="top-header">
      <div className="header-brand">
        <button
          className="sidebar-toggle-btn"
          style={{ display: 'none' }}
          onClick={onToggleSidebar}
          title="Toggle Navigation"
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        <div className="govt-seal">
          <div className="govt-emblem-icon">
            <i className="fa-solid fa-landmark"></i>
          </div>
          <div className="govt-titles">
            <span className="govt-name">Government of India</span>
            <span className="ministry-name">Ministry of Statistics & Programme Implementation</span>
          </div>
        </div>
      </div>

      {/* Global Search */}
      <div className="header-center-search" ref={searchContainerRef}>
        <i className="fa-solid fa-magnifying-glass header-search-icon"></i>
        <input
          type="text"
          className="header-search-input"
          id="globalSearchInput"
          placeholder="Search works, districts, MPs, sanctions or alerts..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => { if (searchValue.trim()) setShowSearchDropdown(true); }}
        />

        <div className={`search-results-dropdown ${showSearchDropdown ? 'show' : ''}`} id="globalSearchResults">
          <div className="search-result-group">Works & Locations</div>
          {searchResults.length === 0 ? (
            <div style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              No matching works found
            </div>
          ) : (
            searchResults.map((m) => (
              <div
                key={m.id}
                className="search-result-item"
                onClick={() => handleSelectSearchResult(m)}
              >
                <div>
                  <div className="sri-title">{m.projectName || m.title}</div>
                  <div className="sri-sub">{m.id} · {m.district}, {m.state}</div>
                </div>
                <span className={`badge-risk ${(m.riskLevel || m.risk || 'moderate').toLowerCase()}`}>
                  {m.riskLevel || m.risk}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="header-actions">
        <span className="sih-badge"><i className="fa-solid fa-trophy"></i> SIH 2026</span>
        <span className="demo-badge">DEMO DATA</span>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }} ref={notifContainerRef}>
          <button
            className="icon-btn"
            id="notifBellBtn"
            title="Notifications"
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifDropdown(!showNotifDropdown);
              setShowAdminDropdown(false);
            }}
          >
            <i className="fa-solid fa-bell"></i>
            <span className="badge-dot"></span>
          </button>

          <div className={`dropdown-menu ${showNotifDropdown ? 'show' : ''}`} id="notifDropdown">
            <div className="dropdown-header">
              <span>Notifications</span>
              <span
                style={{ fontSize: '0.7rem', color: 'var(--risk-critical)', cursor: 'pointer' }}
                onClick={() => alert('All notifications marked as read.')}
              >
                Mark all read
              </span>
            </div>
            <div className="dropdown-item" onClick={() => { setShowNotifDropdown(false); navigate(ROUTES.ALERTS); }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--risk-critical)' }}></i>
              <div>
                <div style={{ fontWeight: 600 }}>Critical Anomaly Detected</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pune · Duplicate work flags triggered</div>
              </div>
            </div>
            <div className="dropdown-item" onClick={() => { setShowNotifDropdown(false); navigate(ROUTES.ALERTS); }}>
              <i className="fa-solid fa-clock-rotate-left" style={{ color: 'var(--risk-high)' }}></i>
              <div>
                <div style={{ fontWeight: 600 }}>Delay Threshold Exceeded</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Lucknow · Hospital project delayed 74 days</div>
              </div>
            </div>
            <div className="dropdown-item" onClick={() => { setShowNotifDropdown(false); navigate(ROUTES.PROFILE); }}>
              <i className="fa-solid fa-file-circle-check" style={{ color: 'var(--green-dark)' }}></i>
              <div>
                <div style={{ fontWeight: 600 }}>Compliance Verified</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Jaipur · Documentation approved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Profile */}
        <div style={{ position: 'relative' }} ref={adminContainerRef}>
          <div
            className="admin-profile"
            id="adminProfileBtn"
            onClick={(e) => {
              e.stopPropagation();
              setShowAdminDropdown(!showAdminDropdown);
              setShowNotifDropdown(false);
            }}
          >
            <div className="admin-avatar">HP</div>
            <div className="admin-info">
              <span className="admin-name">H. Pandey</span>
              <span className="admin-role">Chief Administrator</span>
            </div>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.7rem', color: '#94A3B8', marginLeft: '0.2rem' }}></i>
          </div>

          <div className={`dropdown-menu ${showAdminDropdown ? 'show' : ''}`} id="adminDropdown">
            <div className="dropdown-header">
              <span>Administrator Session</span>
            </div>
            <button
              className="dropdown-item"
              onClick={() => { setShowAdminDropdown(false); navigate(ROUTES.PROFILE); }}
            >
              <i className="fa-solid fa-user-gear"></i> Profile & Roles
            </button>
            <button
              className="dropdown-item"
              onClick={() => { setShowAdminDropdown(false); navigate(ROUTES.PROFILE); }}
            >
              <i className="fa-solid fa-shield"></i> Security Audit Log
            </button>
            <button
              className="dropdown-item"
              id="logoutBtn"
              style={{ color: 'var(--risk-critical)' }}
              onClick={() => {
                setShowAdminDropdown(false);
                if (onOpenLogoutModal) onOpenLogoutModal();
              }}
            >
              <i className="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
