import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export function GovFooter() {
  return (
    <footer className="gov-footer">
      <div className="footer-grid">
        <div>
          <div className="footer-logo-title">MPLADS AI TRANSPARENCY PLATFORM</div>
          <p style={{ fontSize: '0.8rem', color: '#64748B', maxWidth: '400px', lineHeight: 1.5 }}>
            National algorithmic monitoring suite established under the aegis of the Ministry of Statistics and Programme Implementation (MoSPI) to safeguard Member of Parliament Local Area Development Scheme capital assets.
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.75rem' }}>
            Official Portals
          </h4>
          <ul className="footer-links">
            <li><a href="https://mplads.gov.in" target="_blank" rel="noreferrer">MPLADS e-SAKSHI Portal</a></li>
            <li><a href="https://mospi.gov.in" target="_blank" rel="noreferrer">MoSPI Official Website</a></li>
            <li><a href="https://pfms.nic.in" target="_blank" rel="noreferrer">PFMS Realtime Gateway</a></li>
            <li><a href="https://data.gov.in" target="_blank" rel="noreferrer">Open Government Data (OGD)</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.75rem' }}>
            Governance & Security
          </h4>
          <ul className="footer-links">
            <li><Link to={ROUTES.PROFILE}>Audit Trail Standard</Link></li>
            <li><Link to={ROUTES.PROFILE}>ISO 27001 Protocol</Link></li>
            <li><Link to={ROUTES.ALERTS}>NIC Cloud Telemetry</Link></li>
            <li><Link to={ROUTES.REPORTS}>RTI Compliance Matrix</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Ministry of Statistics & Programme Implementation · Government of India</span>
        <span>Designed for Smart India Hackathon (SIH 2026) · Production Prototype v2.4</span>
      </div>
    </footer>
  );
}

export default GovFooter;
