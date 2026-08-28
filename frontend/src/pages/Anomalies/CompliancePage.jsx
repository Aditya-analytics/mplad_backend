import React, { useState, useEffect, useMemo } from 'react';
import { anomalyService } from '../../services/anomalyService';
import { InspectModal } from '../../components/common/InspectModal';
import { formatCurrency } from '../../utils/formatCurrency';

export function CompliancePage() {
  const [compliance, setCompliance] = useState([]);
  const [tableSearch, setTableSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [inspectData, setInspectData] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await anomalyService.getCompliance();
        setCompliance(data);
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
    if (!compliance.length) return { total: 0, fundsBlocked: 0, topViolation: 'None' };
    const total = compliance.length;
    let fundsBlocked = 0;
    const violationCounts = {};
    
    compliance.forEach(c => {
      fundsBlocked += c.amountInQuestion;
      violationCounts[c.violationType] = (violationCounts[c.violationType] || 0) + 1;
    });

    const topViolation = Object.entries(violationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

    return {
      total,
      fundsBlocked: formatCurrency(fundsBlocked),
      topViolation
    };
  }, [compliance]);

  return (
    <section className="view-section active">
      <div className="section-header">
        <h2 className="section-title">
          <i className="fa-solid fa-scale-balanced"></i> Financial Compliance Audit
        </h2>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="dashboard-card" style={{ borderLeft: '4px solid #DC2626' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Rule Violations</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-primary)' }}>{kpis.total}</div>
        </div>
        <div className="dashboard-card" style={{ borderLeft: '4px solid #DC2626' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Illegitimate Funds Blocked</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#DC2626' }}>{kpis.fundsBlocked}</div>
        </div>
        <div className="dashboard-card" style={{ borderLeft: '4px solid var(--navy-primary)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Most Common Violation</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '0.4rem', lineHeight: 1.2 }}>{kpis.topViolation}</div>
        </div>
      </div>

      <div className="dashboard-card">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Compliance Audit...</div>
        ) : compliance.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No compliance violations detected.</div>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Project ID</th>
                  <th>State & Constituency</th>
                  <th>Violation Type</th>
                  <th>Amount in Question</th>
                </tr>
              </thead>
              <tbody>
                {compliance.map((c, i) => (
                  <React.Fragment key={i}>
                    <tr onClick={() => setExpandedRow(expandedRow === i ? null : i)} style={{ cursor: 'pointer', background: expandedRow === i ? 'rgba(255, 153, 51, 0.05)' : '' }}>
                      <td style={{ fontWeight: 700, color: 'var(--navy-primary)' }}>
                        <i className={`fa-solid fa-chevron-${expandedRow === i ? 'down' : 'right'}`} style={{ marginRight: '0.5rem', color: 'var(--text-muted)' }}></i>
                        {c.projectId}
                      </td>
                      <td>{c.state} ({c.constituency})</td>
                      <td style={{ fontWeight: 700, color: '#DC2626' }}>{c.violationType}</td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(c.amountInQuestion)}</td>
                    </tr>
                    {expandedRow === i && (
                      <tr style={{ background: '#f8fafc' }}>
                        <td colSpan="4" style={{ padding: '1.5rem', whiteSpace: 'normal' }}>
                          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 400px' }}>
                              <h4 style={{ fontSize: '0.9rem', color: 'var(--navy-primary)', marginBottom: '0.5rem' }}>Detailed Work Description</h4>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, padding: '1rem', background: '#fff', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                                {c.projectName}
                              </p>
                            </div>
                            <div style={{ flex: '1 1 300px' }}>
                              <h4 style={{ fontSize: '0.9rem', color: 'var(--navy-primary)', marginBottom: '0.5rem' }}>AI Interpretability</h4>
                              <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '4px', border: '2px solid #fca5a5' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '1.5rem', fontStyle: 'italic', background: 'rgba(252, 165, 165, 0.1)', padding: '0.8rem', borderLeft: '3px solid #fca5a5' }}>
                                  "Deterministic Rule Triggered: <strong>{c.violationType}</strong>. The system detected that this project violates statutory compliance guidelines. Specifically, the data indicates: {c.detail}. <strong>{formatCurrency(c.amountInQuestion)}</strong> is currently at risk of being misappropriated."
                                </p>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                  <i className="fa-solid fa-triangle-exclamation" style={{ color: '#DC2626', fontSize: '1.5rem' }}></i>
                                  <span style={{ fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>ACTION REQUIRED</span>
                                </div>
                                <button className="btn-primary" style={{ width: '100%', background: 'var(--navy-primary)' }} onClick={(e) => {
                                  e.stopPropagation();
                                  setInspectData(c);
                                }}>
                                  <i className="fa-solid fa-circle-info" style={{ marginRight: '0.4rem' }}></i> Deep Audit & Rule Check
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
        type="compliance" 
      />
    </section>
  );
}

export default CompliancePage;
