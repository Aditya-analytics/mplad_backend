import React, { useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAnomalies } from '../../hooks/useAnomalies';
import { useProjects } from '../../hooks/useProjects';
import { formatDate } from '../../utils/formatDate';

export function AnomaliesPage() {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const onSelectWork = outletContext?.onSelectWork;
  const { anomalies } = useAnomalies();
  const { projects } = useProjects();
  const doughnutCanvasRef = useRef(null);

  useEffect(() => {
    if (!doughnutCanvasRef.current) return;
    if (typeof window.Chart === 'undefined') return;

    const ctx = doughnutCanvasRef.current.getContext('2d');
    const chart = new window.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Low Risk', 'Moderate Risk', 'High Risk', 'Critical Risk'],
        datasets: [{
          data: [45, 30, 18, 7],
          backgroundColor: ['#10B981', '#D97706', '#EA580C', '#DC2626'],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, font: { size: 11 } },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, []);

  const handleInspectAnomalyWork = (item) => {
    const matchedProject = projects.find((p) => p.id === item.projectId || p.projectName === item.projectName);
    if (matchedProject && onSelectWork) {
      onSelectWork(matchedProject);
    } else {
      navigate(`/app/anomalies/${item.id}`);
    }
  };

  return (
    <section className="view-section active" id="view-ai-risk-monitor">
      {/* HEADER */}
      <div className="section-header">
        <h2 className="section-title">
          <i className="fa-solid fa-microchip"></i> AI Risk Engine Deep Analytics
        </h2>
      </div>

      {/* CHARTS GRID */}
      <div className="grid-2-1" style={{ marginBottom: '1.75rem' }}>
        <div className="dashboard-card">
          <h3 className="section-title">
            <i className="fa-solid fa-chart-pie"></i> Risk Score Distribution across Constituencies
          </h3>
          <div className="chart-container" style={{ height: '260px' }}>
            <canvas ref={doughnutCanvasRef} id="riskDistributionChart"></canvas>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="section-title">
            <i className="fa-solid fa-list-check"></i> Anomaly Classification
          </h3>
          <ul className="stat-list" style={{ marginTop: '1rem' }}>
            <li className="stat-item">
              <span className="stat-label">Duplicate Asset Claims</span>
              <span className="stat-value" style={{ color: 'var(--risk-critical)' }}>142 cases</span>
            </li>
            <li className="stat-item">
              <span className="stat-label">Cost Inflation &gt;30% DSR</span>
              <span className="stat-value" style={{ color: 'var(--risk-high)' }}>218 cases</span>
            </li>
            <li className="stat-item">
              <span className="stat-label">Unusual Vendor Reuse</span>
              <span className="stat-value" style={{ color: 'var(--risk-moderate)' }}>94 cases</span>
            </li>
            <li className="stat-item">
              <span className="stat-label">Ghost Milestone Payments</span>
              <span className="stat-value" style={{ color: 'var(--risk-critical)' }}>66 cases</span>
            </li>
          </ul>
        </div>
      </div>

      {/* FRAUD & ANOMALY RADAR */}
      <div className="dashboard-card">
        <div className="section-header">
          <h3 className="section-title">
            <i className="fa-solid fa-triangle-exclamation"></i> Fraud &amp; Anomaly Audit Radar
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Total Flagged: <b>{anomalies.length} cases</b>
          </span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Cross-referencing GPS geofencing &amp; image telemetry across state public works databases.
        </p>

        <div className="alert-list" id="fraudAlertList">
          {anomalies.map((item) => {
            const sev = (item.severity || 'high').toLowerCase();
            return (
              <div key={item.id} className={`alert-card ${sev}`}>
                <div className="alert-main">
                  <div className="alert-icon-box">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                  </div>
                  <div>
                    <div className="alert-title">{item.projectName}</div>
                    <div className="alert-desc">{item.explanation}</div>
                    <div className="alert-meta">
                      <span><i className="fa-solid fa-location-dot"></i> {item.location}</span>
                      <span><i className="fa-solid fa-clock"></i> Detected: {formatDate(item.detectedAt)}</span>
                      <span><i className="fa-solid fa-brain"></i> Score: <b>{item.riskScore}/100</b></span>
                    </div>
                  </div>
                </div>
                <div className="alert-actions">
                  <button
                    className="btn-primary"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                    onClick={() => handleInspectAnomalyWork(item)}
                  >
                    Inspect Case
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AnomaliesPage;
