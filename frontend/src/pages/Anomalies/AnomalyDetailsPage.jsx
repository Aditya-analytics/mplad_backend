import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { anomalyService } from '../../services/anomalyService';
import { projectService } from '../../services/projectService';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROUTES } from '../../constants/routes';

export function AnomalyDetailsPage() {
  const { anomalyId } = useParams();
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const onSelectWork = outletContext?.onSelectWork;

  const [anomaly, setAnomaly] = useState(null);
  const [project, setProject] = useState(null);
  const [investigationStatus, setInvestigationStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const anomalyData = await anomalyService.getAnomalyById(anomalyId);
        setAnomaly(anomalyData);
        setInvestigationStatus(anomalyData.status);

        if (anomalyData.projectId) {
          const projectData = await projectService.getProjectById(anomalyData.projectId);
          setProject(projectData);
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [anomalyId]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await anomalyService.updateAnomalyStatus(anomalyId, newStatus);
      setInvestigationStatus(newStatus);
      setAnomaly({ ...anomaly, status: newStatus });
    } catch (err) {
      alert('Failed to update investigation status');
    } finally {
      setUpdating(false);
    }
  };

  if (!anomaly) {
    return (
      <div className="dashboard-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading Anomaly Investigation Profile...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <button
        onClick={() => navigate(ROUTES.ANOMALIES)}
        className="btn-secondary"
        style={{ width: 'fit-content', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
      >
        <i className="fa-solid fa-arrow-left"></i> Back to AI Risk Monitor
      </button>

      <div className="dashboard-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 800, color: 'var(--navy-primary)' }}>{anomaly.id}</span>
              <span className={`badge-risk ${(anomaly.severity || 'critical').toLowerCase()}`}>
                {anomaly.type} ANOMALY
              </span>
            </div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '0.3rem' }}>
              {anomaly.projectName}
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              <i className="fa-solid fa-location-dot" style={{ marginRight: '0.3rem' }}></i> {anomaly.location} · Detected: {formatDate(anomaly.detectedAt)}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
            <span className="badge-risk critical" style={{ fontSize: '0.85rem' }}>
              Risk Score: {anomaly.riskScore}/100
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              AI Confidence: <b>{(anomaly.confidence * 100).toFixed(0)}%</b>
            </span>
          </div>
        </div>

        {/* AI REASONING CARD */}
        <div className="ai-reasoning-card" style={{ marginBottom: '1.5rem' }}>
          <div className="ai-reasoning-header">
            <i className="fa-solid fa-brain"></i> Algorithmic Inference &amp; Spatial Risk Reasoning
          </div>
          <p style={{ fontSize: '0.85rem', color: '#1E3A8A', lineHeight: 1.5 }}>
            {anomaly.explanation}
          </p>
        </div>

        {/* INVESTIGATION WORKFLOW */}
        <div style={{ background: 'var(--ash-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.85rem' }}>
            <i className="fa-solid fa-clipboard-question" style={{ marginRight: '0.4rem' }}></i> Statutory Investigation &amp; Review Workflow
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                Investigation Status:
              </label>
              <select
                className="select-filter"
                style={{ width: '100%' }}
                value={investigationStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
              >
                <option value="FLAGGED">🔴 FLAGGED - Requires Review</option>
                <option value="UNDER_INVESTIGATION">🔵 UNDER_INVESTIGATION</option>
                <option value="REQUIRES_REVIEW">⚠️ REQUIRES_REVIEW</option>
                <option value="CONFIRMED">✅ CONFIRMED Anomaly</option>
                <option value="FALSE_POSITIVE">❌ FALSE_POSITIVE</option>
                <option value="RESOLVED">✔️ RESOLVED</option>
              </select>
            </div>

            <div>
              <button
                className="btn-primary"
                style={{ width: '100%' }}
                disabled={updating}
                onClick={() => alert(`Collector Audit Notice issued for Anomaly ${anomaly.id}.`)}
              >
                <i className="fa-solid fa-paper-plane"></i> Dispatch Field Audit Notice
              </button>
            </div>
          </div>
        </div>

        {/* ASSOCIATED PROJECT CARD */}
        {project && (
          <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Associated Constituency Project</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-primary)', marginTop: '0.2rem' }}>{project.projectName}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {project.id} · {project.district}, {project.state} · Sanctioned: {formatCurrency(project.sanctionedAmount)}
              </div>
            </div>
            <button
              className="btn-secondary"
              onClick={() => {
                if (onSelectWork) {
                  onSelectWork(project);
                } else {
                  navigate(`/app/projects/${project.id}`);
                }
              }}
            >
              <i className="fa-solid fa-eye"></i> View Full Project Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnomalyDetailsPage;
