import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      {/* HERO SECTION */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="hero-tag" style={{ width: 'fit-content' }}>
            <i className="fa-solid fa-wand-magic-sparkles"></i> AI-POWERED TRANSPARENCY GOVERNANCE
          </div>

          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.4rem', fontWeight: 800, color: 'var(--navy-primary)', lineHeight: 1.2 }}>
            AI-Powered Intelligence for Transparent MPLADS Implementation
          </h1>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Continuous algorithmic surveillance across all 543 Parliamentary constituencies monitoring fund disbursement velocity, physical milestone telemetry, and preventing duplicate works.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button
              className="btn-primary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', background: 'linear-gradient(135deg, var(--saffron), var(--saffron-dark))' }}
              onClick={() => navigate(ROUTES.LOGIN)}
            >
              <i className="fa-solid fa-shield-halved" style={{ marginRight: '0.4rem' }}></i>
              Access Monitoring Portal
            </button>
          </div>
        </div>

        {/* TELEMETRY CARD */}
        <div className="hero-banner" style={{ margin: 0 }}>
          <i className="fa-solid fa-archway hero-bg-pattern"></i>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 800, color: 'var(--saffron)', fontSize: '0.9rem' }}>National Live Telemetry</span>
            <span className="demo-badge">LIVE 2026</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: 700 }}>Total Monitored</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>18,642</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: 700 }}>Funds Utilized</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.6rem', fontWeight: 800, color: 'var(--saffron)', marginTop: '0.2rem' }}>₹3,917 Cr</div>
            </div>
          </div>

          <div style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#FCA5A5', marginBottom: '0.4rem' }}>
              <span>National AI Risk Index</span>
              <span>72 / 100</span>
            </div>
            <div className="progress-bar-sm">
              <div className="progress-fill" style={{ width: '72%', background: 'var(--risk-critical)' }}></div>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#CBD5E1', marginTop: '0.4rem' }}>
              638 active anomalies flagged requiring District Magistrate audit review.
            </p>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section style={{ borderTop: '1px solid var(--border-light)', paddingTop: '2.5rem' }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-primary)', textAlign: 'center', marginBottom: '2rem' }}>
          Platform Governance Capabilities
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div className="dashboard-card">
            <i className="fa-solid fa-brain" style={{ fontSize: '1.8rem', color: 'var(--saffron)', marginBottom: '0.75rem', display: 'block' }}></i>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.35rem' }}>Anomaly Engine</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Detects abnormal expenditure velocity and milestone billing mismatches with isolation forest algorithms.
            </p>
          </div>

          <div className="dashboard-card">
            <i className="fa-solid fa-map-location-dot" style={{ fontSize: '1.8rem', color: 'var(--india-green)', marginBottom: '0.75rem', display: 'block' }}></i>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.35rem' }}>Geofence Telemetry</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Cross-references geotagged site imagery with physical coordinates to prevent duplicate asset claims.
            </p>
          </div>

          <div className="dashboard-card">
            <i className="fa-solid fa-indian-rupee-sign" style={{ fontSize: '1.8rem', color: 'var(--navy-border)', marginBottom: '0.75rem', display: 'block' }}></i>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.35rem' }}>PFMS Real-time Sync</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Direct integration with Public Financial Management System treasury escrow disbursements.
            </p>
          </div>

          <div className="dashboard-card">
            <i className="fa-solid fa-clipboard-check" style={{ fontSize: '1.8rem', color: 'var(--saffron-dark)', marginBottom: '0.75rem', display: 'block' }}></i>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.35rem' }}>Statutory Auditing</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Generates instant compliance audit notices for District Collectors and Ministry officials.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
