import React, { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { formatCurrency } from '../../utils/formatCurrency';

export function ReportsPage() {
  const { projects } = useProjects();
  const [state, setState] = useState('ALL');
  const [riskLevel, setRiskLevel] = useState('ALL');

  const handleExportCSV = () => {
    const filtered = projects.filter((p) => {
      const matchesState = state === 'ALL' || (p.state && p.state.toLowerCase() === state.toLowerCase());
      const matchesRisk = riskLevel === 'ALL' || (p.riskLevel && (riskLevel === 'HIGH' ? (p.riskLevel === 'HIGH' || p.riskLevel === 'CRITICAL') : p.riskLevel === riskLevel));
      return matchesState && matchesRisk;
    });

    let csvContent = 'data:text/csv;charset=utf-8,Work ID,Project Description,State,District,Constituency,Sanctioned,Spent,Progress,Delay,Risk Score,Risk Level\n';
    filtered.forEach((w) => {
      const sanctioned = typeof w.sanctionedAmount === 'number' ? formatCurrency(w.sanctionedAmount) : (w.sanctioned || '');
      const spent = typeof w.utilizedAmount === 'number' ? formatCurrency(w.utilizedAmount) : (w.spent || '');
      const progress = w.physicalProgress !== undefined ? w.physicalProgress : (w.progress || 0);
      const delay = w.delayDays !== undefined ? w.delayDays : (w.delay || 0);
      const score = w.riskScore !== undefined ? w.riskScore : (w.score || 0);
      const risk = w.riskLevel || w.risk || 'MODERATE';

      csvContent += `"${w.id}","${w.projectName || w.title}","${w.state}","${w.district}","${w.constituency || ''}","${sanctioned}","${spent}","${progress}%","${delay} days","${score}","${risk}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MPLADS_Governance_Report_${state}_${riskLevel}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="view-section active" id="view-reports">
      <div className="section-header">
        <h2 className="section-title">
          <i className="fa-solid fa-file-invoice"></i> Governance Report Generator
        </h2>
      </div>

      <div className="dashboard-card" style={{ maxWidth: '650px' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.05rem', color: 'var(--navy-primary)' }}>
          Generate Official Audit Summary
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-primary)', display: 'block', marginBottom: '0.3rem' }}>
              Select State / Region:
            </label>
            <select
              className="select-filter"
              style={{ width: '100%' }}
              id="reportStateSelect"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="ALL">All States (National Summary)</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-primary)', display: 'block', marginBottom: '0.3rem' }}>
              Risk Level Filter:
            </label>
            <select
              className="select-filter"
              style={{ width: '100%' }}
              id="reportRiskSelect"
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
            >
              <option value="ALL">All Risk Categories</option>
              <option value="HIGH">High Risk &amp; Critical Only</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" onClick={handleExportCSV}>
            <i className="fa-solid fa-download"></i> Export CSV
          </button>
          <button className="btn-secondary" onClick={() => window.print()}>
            <i className="fa-solid fa-print"></i> Print Report
          </button>
        </div>
      </div>
    </section>
  );
}

export default ReportsPage;
