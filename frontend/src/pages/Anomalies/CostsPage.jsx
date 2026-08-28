import React, { useState, useEffect, useMemo } from 'react';
import { anomalyService } from '../../services/anomalyService';
import { InspectModal } from '../../components/common/InspectModal';
import { formatCurrency } from '../../utils/formatCurrency';

export function CostsPage() {
  const [costs, setCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableSearch, setTableSearch] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [inspectData, setInspectData] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await anomalyService.getCosts();
        setCosts(data);
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
    if (!costs.length) return { total: 0, fundsAtRisk: 0, avgScore: 0 };
    const total = costs.length;
    let fundsAtRisk = 0;
    let totalScore = 0;
    costs.forEach(c => {
      // difference between recommended and mean
      const diff = Math.max(0, c.recommendedAmount - c.categoryMean);
      fundsAtRisk += diff;
      totalScore += parseFloat(c.anomalyScore);
    });
    return {
      total,
      fundsAtRisk: formatCurrency(fundsAtRisk),
      avgScore: (totalScore / total).toFixed(2)
    };
  }, [costs]);

  return (
    <section className="view-section active">
      <div className="section-header">
        <h2 className="section-title">
          <i className="fa-solid fa-money-bill-wave"></i> Cost Outlier Radar (Isolation Forest)
        </h2>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="dashboard-card" style={{ borderLeft: '4px solid #fca5a5' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Outliers</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-primary)' }}>{kpis.total}</div>
        </div>
        <div className="dashboard-card" style={{ borderLeft: '4px solid #DC2626' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Funds At Risk (Overshoot)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#DC2626' }}>{kpis.fundsAtRisk}</div>
        </div>
        <div className="dashboard-card" style={{ borderLeft: '4px solid var(--navy-primary)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Avg Isolation Score</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-primary)' }}>{kpis.avgScore}</div>
        </div>
      </div>

      <div className="dashboard-card">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Cost Radar...</div>
        ) : costs.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No anomalies detected.</div>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Project ID</th>
                  <th>State & Constituency</th>
                  <th>Recommended Amount</th>
                  <th>Category Mean</th>
                  <th>Severity Score</th>
                </tr>
              </thead>
              <tbody>
                {costs.map((c, i) => (
                  <React.Fragment key={i}>
                    <tr onClick={() => setExpandedRow(expandedRow === i ? null : i)} style={{ cursor: 'pointer', background: expandedRow === i ? 'rgba(255, 153, 51, 0.05)' : '' }}>
                      <td style={{ fontWeight: 700, color: 'var(--navy-primary)' }}>
                        <i className={`fa-solid fa-chevron-${expandedRow === i ? 'down' : 'right'}`} style={{ marginRight: '0.5rem', color: 'var(--text-muted)' }}></i>
                        {c.projectId}
                      </td>
                      <td>{c.state} ({c.constituency})</td>
                      <td style={{ fontWeight: 700, color: '#DC2626' }}>{formatCurrency(c.recommendedAmount)}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{formatCurrency(c.categoryMean)}</td>
                      <td>
                        <span className="badge-risk high" style={{ padding: '0.2rem 0.5rem' }}>
                          Score: {c.anomalyScore}
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
                                {c.projectName}
                              </p>
                            </div>
                            <div style={{ flex: '1 1 300px' }}>
                              <h4 style={{ fontSize: '0.9rem', color: 'var(--navy-primary)', marginBottom: '0.5rem' }}>AI Interpretability</h4>
                              <div style={{ padding: '1rem', background: '#fff', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '1.5rem', fontStyle: 'italic', background: 'rgba(252, 165, 165, 0.1)', padding: '0.8rem', borderLeft: '3px solid #fca5a5' }}>
                                  "The historical average cost for this category of work in {c.state} is <strong>{formatCurrency(c.categoryMean)}</strong>. This project's sanctioned request is <strong>{formatCurrency(c.recommendedAmount)}</strong>, which is <strong>{((c.recommendedAmount / c.categoryMean - 1) * 100).toFixed(1)}% higher</strong> than the baseline for similar work. The Isolation Forest algorithm has flagged this as a severe statistical anomaly."
                                </p>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                  <span>Category Historical Mean:</span>
                                  <span style={{ fontWeight: 600 }}>{formatCurrency(c.categoryMean)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                  <span>Requested Sanction Amount:</span>
                                  <span style={{ fontWeight: 600, color: '#DC2626' }}>{formatCurrency(c.recommendedAmount)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                  <span style={{ fontWeight: 700 }}>Total Unjustified Overshoot:</span>
                                  <span style={{ fontWeight: 700, color: '#DC2626' }}>+{formatCurrency(Math.max(0, c.recommendedAmount - c.categoryMean))}</span>
                                </div>
                                <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.5rem', background: 'var(--navy-primary)' }} onClick={(e) => {
                                  e.stopPropagation();
                                  setInspectData(c);
                                }}>
                                  <i className="fa-solid fa-circle-info" style={{ marginRight: '0.4rem' }}></i> More Info & Detailed Breakdown
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
        type="cost" 
      />
    </section>
  );
}

export default CostsPage;
