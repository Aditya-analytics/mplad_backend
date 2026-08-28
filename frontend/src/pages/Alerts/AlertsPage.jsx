import React, { useState, useEffect } from 'react';
import { alertService } from '../../services/alertService';

export function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await alertService.getAlerts();
        setAlerts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDismiss = async (id) => {
    await alertService.dismissAlert(id);
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const handleEscalate = (alertItem) => {
    alert(`Alert "${alertItem.title}" escalated to Secretary, MoSPI & District Collector (${alertItem.location || 'Local Division'}).`);
  };

  return (
    <section className="view-section active" id="view-alerts">
      <div className="section-header">
        <h2 className="section-title">
          <i className="fa-solid fa-bell"></i> Real-time Alert Command Center
        </h2>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Active Alerts: <b>{alerts.length}</b>
        </span>
      </div>

      <div className="alert-list" id="mainAlertList">
        {loading ? (
          <div className="dashboard-card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Connecting to Real-time Alert Notification Bus...
          </div>
        ) : alerts.length === 0 ? (
          <div className="dashboard-card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            All alerts resolved. No outstanding critical flags.
          </div>
        ) : (
          alerts.map((a) => {
            const sev = (a.severity || 'high').toLowerCase();
            return (
              <div key={a.id} className={`alert-card ${sev}`}>
                <div className="alert-main">
                  <div className="alert-icon-box">
                    <i className={`fa-solid ${sev === 'critical' ? 'fa-triangle-exclamation' : sev === 'high' ? 'fa-clock-rotate-left' : 'fa-bell'}`}></i>
                  </div>
                  <div>
                    <div className="alert-title">{a.title}</div>
                    <div className="alert-desc">{a.message || a.desc}</div>
                    <div className="alert-meta">
                      <span><i className="fa-solid fa-location-dot"></i> {a.location}</span>
                      <span><i className="fa-solid fa-clock"></i> {a.time || a.detectedAt}</span>
                      <span style={{ fontWeight: 700, color: sev === 'critical' ? 'var(--risk-critical)' : 'inherit' }}>
                        Severity: {a.severity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="alert-actions">
                  <button
                    className="btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                    onClick={() => handleDismiss(a.id)}
                  >
                    Dismiss
                  </button>
                  <button
                    className="btn-primary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                    onClick={() => handleEscalate(a)}
                  >
                    Escalate Notice
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default AlertsPage;
