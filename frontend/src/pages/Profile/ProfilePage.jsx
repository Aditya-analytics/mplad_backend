import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* COMPLIANCE SECTION */}
      <section className="view-section active" id="compliance">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fa-solid fa-clipboard-check"></i> Statutory Compliance Tracker
          </h2>
        </div>
        <div className="dashboard-card">
          <div className="stat-list">
            <div className="stat-item">
              <span className="stat-label">Documentation Completeness</span>
              <span className="stat-value" style={{ color: 'var(--green-dark)' }}>94%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Sanction Compliance</span>
              <span className="stat-value" style={{ color: 'var(--green-dark)' }}>89%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Physical Progress Verification</span>
              <span className="stat-value" style={{ color: 'var(--risk-high)' }}>83%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Utilization Certificate (UC) Filing</span>
              <span className="stat-value" style={{ color: 'var(--green-dark)' }}>91%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ADMINISTRATOR PROFILE */}
      <section className="view-section active">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fa-solid fa-user-shield"></i> Administrator Profile &amp; Clearance
          </h2>
        </div>
        <div className="dashboard-card" style={{ maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="admin-avatar" style={{ width: '56px', height: '56px', fontSize: '1.2rem' }}>
              {user?.avatar || 'HP'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
                {user?.name || 'H. Pandey'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {user?.designation || 'Chief Administrator'} · {user?.department || 'MoSPI Infrastructure Wing'}
              </p>
              <span className="badge-risk low" style={{ marginTop: '0.35rem', display: 'inline-block' }}>
                LEVEL 4 CLEARANCE
              </span>
            </div>
          </div>

          <div className="stat-list">
            <div className="stat-item">
              <span className="stat-label">Official Email:</span>
              <span className="stat-value">{user?.email || 'admin@mospi.gov.in'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Access Level:</span>
              <span className="stat-value">National Infrastructure Surveillance</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Audit Session ID:</span>
              <span className="stat-value" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>MPLAD-AUTH-2026-X99</span>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM CONFIGURATION */}
      <section className="view-section active" id="settings">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fa-solid fa-sliders"></i> Platform Settings
          </h2>
        </div>
        <div className="dashboard-card" style={{ maxWidth: '650px' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.05rem', color: 'var(--navy-primary)' }}>
            System Configuration
          </h3>
          <div className="stat-list">
            <div className="stat-item">
              <span className="stat-label">AI Anomaly Threshold Sensitivity</span>
              <span className="stat-value">0.75 (High)</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Geofencing Radius</span>
              <span className="stat-value">50 Meters</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">PFMS Real-time Sync Interval</span>
              <span className="stat-value">15 Mins</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;
