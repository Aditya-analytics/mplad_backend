import React, { useState, useEffect, useMemo } from 'react';
import { anomalyService } from '../../services/anomalyService';
import { InspectModal } from '../../components/common/InspectModal';

export function DelaysPage() {
  const [delays, setDelays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableSearch, setTableSearch] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [inspectData, setInspectData] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await anomalyService.getDelays();
        setDelays(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  // Compute KPIs
  const kpis = useMemo(() => {
    if (!delays.length) return { total: 0, critical: 0, avgDelay: 0 };
    const total = delays.length;
    let critical = 0;
    let totalPredictedDelay = 0;
    delays.forEach(d => {
      if (d.delayRisk >= 75) critical++;
      totalPredictedDelay += d.predictedDays;
    });
    return {
      total,
      critical,
      avgDelay: Math.round(totalPredictedDelay / total)
    };
  }, [delays]);

  return (
    <section className="view-section active">
      <div className="section-header">
        <h2 className="section-title">
          <i className="fa-solid fa-clock-rotate-left"></i> Delay Risk Predictor (Random Forest)
        </h2>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="dashboard-card" style={{ borderLeft: '4px solid #fde047' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total At-Risk Projects</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-primary)' }}>{kpis.total}</div>
        </div>
        <div className="dashboard-card" style={{ borderLeft: '4px solid #D97706' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Critical Overruns (>75% Prob)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706' }}>{kpis.critical}</div>
        </div>
        <div className="dashboard-card" style={{ borderLeft: '4px solid var(--navy-primary)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Avg Predicted Delay</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-primary)' }}>{kpis.avgDelay} days</div>
        </div>
      </div>

      <div className="dashboard-card">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Delay Predictions...</div>
        ) : delays.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No delays predicted.</div>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Project ID</th>
                  <th>State & Constituency</th>
                  <th>Current Delay</th>
                  <th>ML Predicted Delay</th>
                  <th>Risk Probability</th>
                </tr>
              </thead>
              <tbody>
                {delays.map((d, i) => (
                  <React.Fragment key={i}>
                    <tr onClick={() => setExpandedRow(expandedRow === i ? null : i)} style={{ cursor: 'pointer', background: expandedRow === i ? 'rgba(255, 153, 51, 0.05)' : '' }}>
                      <td style={{ fontWeight: 700, color: 'var(--navy-primary)' }}>
                        <i className={`fa-solid fa-chevron-${expandedRow === i ? 'down' : 'right'}`} style={{ marginRight: '0.5rem', color: 'var(--text-muted)' }}></i>
                        {d.projectId}
                      </td>
                      <td>{d.state} ({d.constituency})</td>
                      <td style={{ fontWeight: 600 }}>{d.daysOverdue} days</td>
                      <td style={{ fontWeight: 700, color: '#D97706' }}>{d.predictedDays} days</td>
                      <td>
                        <span className="badge-risk moderate" style={{ padding: '0.2rem 0.5rem' }}>
                          {d.delayRisk}% Probability
                        </span>
                      </td>
                    </tr>
                    {expandedRow === i && (
                      <tr style={{ background: '#f8fafc' }}>
                        <td colSpan="5" style={{ padding: '1.5rem', whiteSpace: 'normal' }}>
                          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 400px' }}>
                              <h4 style={{ fontSize: '0.9rem', color: 'var(--navy-primary)', marginBottom: '0.5rem' }}>Detailed Work Description</h4>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, padding: '1rem', background: '#fff', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                                {d.projectName}
                              </p>
                            </div>
                            <div style={{ flex: '1 1 300px' }}>
                              <h4 style={{ fontSize: '0.9rem', color: 'var(--navy-primary)', marginBottom: '0.5rem' }}>AI Interpretability</h4>
                              <div style={{ padding: '1rem', background: '#fff', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '1.5rem', fontStyle: 'italic', background: 'rgba(253, 224, 71, 0.1)', padding: '0.8rem', borderLeft: '3px solid #fde047' }}>
                                  "Historical ML analysis shows that similar <strong>{d.category}</strong> projects in <strong>{d.state}</strong> complete on average in <strong>{Math.round(d.predictedDays)} days</strong>. However, this project has already been active for <strong>{d.elapsedDays} days</strong> and is currently <strong>{d.daysOverdue} days overdue</strong> compared to the state baseline. This indicates a severe structural schedule overrun."
                                </p>
                                
                                {/* Timeline Visualizer from previous design, embedded here */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
                                  <span style={{ color: 'var(--text-muted)' }}>Current: {d.daysOverdue}d</span>
                                  <span style={{ color: '#D97706' }}>Predicted: {Math.round(d.predictedDays)}d</span>
                                </div>
                                
                                <div style={{ width: '100%', height: '14px', background: 'rgba(0,0,0,0.05)', borderRadius: '7px', position: 'relative', display: 'flex', marginBottom: '1.5rem' }}>
                                   <div style={{ width: '40%', background: 'var(--navy-primary)', borderRadius: '7px 0 0 7px' }}></div>
                                   <div style={{ width: '60%', background: 'repeating-linear-gradient(45deg, #fde047, #fde047 10px, #fef08a 10px, #fef08a 20px)', borderRadius: '0 7px 7px 0' }}></div>
                                   <div style={{ position: 'absolute', left: '40%', top: '-6px', width: '2px', height: '26px', background: '#000' }}></div>
                                   <div style={{ position: 'absolute', left: 'calc(40% - 22px)', top: '-24px', fontSize: '0.65rem', fontWeight: 700, color: '#000' }}>TODAY</div>
                                </div>

                                <button className="btn-primary" style={{ width: '100%', padding: '0.5rem', background: 'var(--navy-primary)' }} onClick={(e) => {
                                  e.stopPropagation();
                                  setInspectData(d);
                                }}>
                                  <i className="fa-solid fa-circle-info" style={{ marginRight: '0.4rem' }}></i> Deep Audit & Predictive Timeline
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <InspectModal 
        isOpen={!!inspectData} 
        onClose={() => setInspectData(null)} 
        data={inspectData} 
        type="delay" 
      />
    </section>
  );
}

export default DelaysPage;
