import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { ROUTES } from '../../constants/routes';

export function ProjectDetailsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const onSelectWork = outletContext?.onSelectWork;

  const [project, setProject] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await projectService.getProjectById(projectId);
        setProject(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [projectId]);

  if (!project) {
    return (
      <div className="dashboard-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading Project Intelligence Profile...</p>
      </div>
    );
  }

  const handleIssueCollectorNotice = () => {
    alert(`Statutory Audit Notice dispatched to District Collector (${project.district}) for Project ${project.id}.`);
  };

  const risk = (project.riskLevel || 'MODERATE').toLowerCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <button
        onClick={() => navigate(ROUTES.PROJECTS)}
        className="btn-secondary"
        style={{ width: 'fit-content', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
      >
        <i className="fa-solid fa-arrow-left"></i> Back to Master Registry
      </button>

      <div className="dashboard-card">
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1.2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 800, color: 'var(--navy-primary)' }}>{project.id}</span>
              <span className={`badge-risk ${risk}`}>{project.status}</span>
            </div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '0.3rem' }}>
              {project.projectName}
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              <i className="fa-solid fa-location-dot" style={{ marginRight: '0.3rem', color: 'var(--saffron)' }}></i>
              {project.district}, {project.state} · MP Constituency: {project.constituency}
            </p>
          </div>

          <button className="btn-primary" onClick={handleIssueCollectorNotice}>
            <i className="fa-solid fa-paper-plane"></i> Issue Collector Audit Notice
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '1.2rem' }}>
          {project.description}
        </p>

        {/* METRICS GRID */}
        <div className="modal-grid-2" style={{ marginBottom: '1.5rem' }}>
          <div className="info-block">
            <div className="info-block-label">Sanctioned Amount</div>
            <div className="info-block-val">{formatCurrency(project.sanctionedAmount)}</div>
          </div>
          <div className="info-block">
            <div className="info-block-label">Total Expenditure (Spent)</div>
            <div className="info-block-val">{formatCurrency(project.utilizedAmount)}</div>
          </div>
          <div className="info-block">
            <div className="info-block-label">Physical Progress</div>
            <div className="info-block-val">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{project.physicalProgress}%</span>
                <div className="progress-bar-sm" style={{ width: '80px' }}>
                  <div className="progress-fill" style={{ width: `${project.physicalProgress}%`, background: 'var(--navy-primary)' }}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="info-block">
            <div className="info-block-label">Schedule Overrun (Delay)</div>
            <div className="info-block-val" style={{ color: project.delayDays > 60 ? 'var(--risk-critical)' : 'var(--risk-high)' }}>
              +{project.delayDays} Days
            </div>
          </div>
        </div>

        {/* STAKEHOLDERS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.2rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.75rem' }}>
              <i className="fa-solid fa-users-gear" style={{ marginRight: '0.4rem' }}></i> Stakeholder Records
            </h3>
            <div className="stat-list">
              <div className="stat-item">
                <span className="stat-label">MP Representative:</span>
                <span className="stat-value">{project.mpName}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Implementing Agency:</span>
                <span className="stat-value">{project.implementingAgency}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Contractor / Vendor:</span>
                <span className="stat-value">{project.vendor}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.75rem' }}>
              <i className="fa-solid fa-calendar-days" style={{ marginRight: '0.4rem' }}></i> Timeline Milestones
            </h3>
            <div className="stat-list">
              <div className="stat-item">
                <span className="stat-label">Sanction / Start Date:</span>
                <span className="stat-value">{formatDate(project.startDate)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Expected Completion:</span>
                <span className="stat-value">{formatDate(project.expectedCompletion)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Geofence Telemetry:</span>
                <span className="stat-value" style={{ color: project.geofenceVerified ? 'var(--green-dark)' : 'var(--risk-critical)' }}>
                  {project.geofenceVerified ? 'Verified Active' : 'Unverified Site'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI RISK CARD */}
        {project.aiRiskAnalysis && (
          <div className="ai-reasoning-card" style={{ marginBottom: '1.5rem' }}>
            <div className="ai-reasoning-header">
              <i className="fa-solid fa-brain"></i> AI Anomaly Risk Analysis (Score: <span>{project.riskScore}</span>/100)
            </div>
            <p style={{ fontSize: '0.85rem', color: '#1E3A8A', lineHeight: 1.5 }}>
              {project.aiRiskAnalysis.overallAssessment}
            </p>
          </div>
        )}

        {/* MILESTONES TABLE */}
        {project.milestones && project.milestones.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.75rem' }}>
              <i className="fa-solid fa-list-check" style={{ marginRight: '0.4rem' }}></i> Physical Work Milestones
            </h3>
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Milestone Name</th>
                    <th>Target Date</th>
                    <th>Progress</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {project.milestones.map((m) => (
                    <tr key={m.id}>
                      <td>{m.name}</td>
                      <td>{formatDate(m.targetDate)}</td>
                      <td>{m.progress}%</td>
                      <td>
                        <span className={`badge-risk ${m.status === 'COMPLETED' ? 'low' : m.status === 'DELAYED' ? 'critical' : 'moderate'}`}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PFMS TRANSACTIONS TABLE */}
        {project.pfmsTransactions && project.pfmsTransactions.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.2rem' }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.75rem' }}>
              <i className="fa-solid fa-receipt" style={{ marginRight: '0.4rem' }}></i> PFMS Disbursement Audit Trail
            </h3>
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Voucher No</th>
                    <th>Disbursement Date</th>
                    <th>Disbursement Type</th>
                    <th>Amount</th>
                    <th>PFMS Status</th>
                  </tr>
                </thead>
                <tbody>
                  {project.pfmsTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td style={{ fontWeight: 700 }}>{tx.voucherNo}</td>
                      <td>{formatDate(tx.date)}</td>
                      <td>{tx.type}</td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(tx.amount)}</td>
                      <td>
                        <span className={`badge-risk ${tx.status === 'DISBURSED' ? 'low' : 'critical'}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
