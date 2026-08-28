import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--navy-dark)', color: '#ffffff', padding: '1.5rem', textAlign: 'center' }}>
      <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '4rem', color: 'var(--saffron)', marginBottom: '1rem', animation: 'pulse 1.5s infinite ease-in-out' }}></i>
      <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        404 — Page Not Found
      </h1>
      <p style={{ fontSize: '0.9rem', color: '#94A3B8', maxWidth: '460px', marginBottom: '1.5rem' }}>
        The requested monitoring route or telemetry resource does not exist within the MPLADS AI Governance Platform.
      </p>
      <button
        className="btn-primary"
        style={{ background: 'linear-gradient(135deg, var(--saffron), var(--saffron-dark))', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
        onClick={() => navigate(ROUTES.DASHBOARD)}
      >
        <i className="fa-solid fa-arrow-left" style={{ marginRight: '0.4rem' }}></i>
        Return to Command Center
      </button>
    </div>
  );
}

export default NotFoundPage;
