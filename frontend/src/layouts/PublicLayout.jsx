import React from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';

export function PublicLayout() {
  const { isAuthenticated, loading } = useAuth();

  // If user is already logged in, send them straight to dashboard
  if (!loading && isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--ash-bg)', color: 'var(--text-main)', fontFamily: "'Inter', sans-serif" }}>
      <header style={{ background: 'var(--navy-primary)', color: '#ffffff', borderBottom: '3px solid var(--saffron)', padding: '0.8rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: '#ffffff' }}>
            <div className="govt-emblem-icon">
              <i className="fa-solid fa-landmark"></i>
            </div>
            <div className="govt-titles">
              <span className="govt-name">Government of India</span>
              <span className="ministry-name">Ministry of Statistics &amp; Programme Implementation</span>
            </div>
          </Link>

          <Link
            to={ROUTES.LOGIN}
            className="btn-primary"
            style={{ textDecoration: 'none', background: 'linear-gradient(135deg, var(--saffron), var(--saffron-dark))', color: '#ffffff', fontWeight: 700 }}
          >
            <i className="fa-solid fa-lock" style={{ marginRight: '0.3rem' }}></i> Official Portal Login
          </Link>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer className="gov-footer" style={{ marginTop: 0 }}>
        <div className="footer-bottom" style={{ borderTop: 'none', paddingTop: 0 }}>
          <span>© 2026 Ministry of Statistics &amp; Programme Implementation · Government of India</span>
          <span>Designed for Smart India Hackathon (SIH 2026) · Production Prototype v2.4</span>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
