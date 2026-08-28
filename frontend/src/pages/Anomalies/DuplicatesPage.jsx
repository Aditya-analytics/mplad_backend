import React, { useState, useEffect, useMemo } from 'react';
import { anomalyService } from '../../services/anomalyService';
import { InspectModal } from '../../components/common/InspectModal';

export function DuplicatesPage() {
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [inspectData, setInspectData] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await anomalyService.getDuplicates();
        setDuplicates(data);
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
    if (!duplicates.length) return { total: 0, states: 0, avgMatch: 0 };
    const states = new Set(duplicates.map(d => d.state));
    const avgMatch = duplicates.reduce((acc, curr) => acc + parseFloat(curr.similarityScore), 0) / duplicates.length;
    return {
      total: duplicates.length,
      states: states.size,
      avgMatch: avgMatch.toFixed(1)
    };
  }, [duplicates]);

  // Compute State breakdown
  const stateBreakdown = useMemo(() => {
    const counts = {};
    duplicates.forEach(d => {
      const st = d.state || 'Unknown';
      counts[st] = (counts[st] || 0) + 1;
    });
    return Object.entries(counts).map(([state, count]) => ({ state, count })).sort((a, b) => b.count - a.count);
  }, [duplicates]);

  const filteredDuplicates = useMemo(() => {
    if (!selectedState) return [];
    return duplicates.filter(d => (d.state || 'Unknown') === selectedState);
  }, [duplicates, selectedState]);

  return (
    <section className="view-section active">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="section-title">
          <i className="fa-solid fa-copy"></i> Duplicate Works Radar (NLP)
        </h2>
        {selectedState && (
          <button className="btn-secondary" onClick={() => setSelectedState(null)}>
            <i className="fa-solid fa-arrow-left"></i> Back to States
          </button>
        )}
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="dashboard-card" style={{ borderLeft: '4px solid var(--risk-critical)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Duplicates</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-primary)' }}>{kpis.total}</div>
        </div>
        <div className="dashboard-card" style={{ borderLeft: '4px solid var(--saffron)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Affected States</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-primary)' }}>{kpis.states}</div>
        </div>
        <div className="dashboard-card" style={{ borderLeft: '4px solid var(--navy-primary)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Avg. Similarity Match</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-primary)' }}>{kpis.avgMatch}%</div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Analysis...</div>
      ) : !selectedState ? (
        // STATE CARDS VIEW
        <div>
          <h3 style={{ marginBottom: '1rem', color: 'var(--navy-primary)' }}>Select State to Drill Down</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {stateBreakdown.map((sb, idx) => (
              <div 
                key={idx} 
                className="dashboard-card" 
                style={{ cursor: 'pointer', transition: 'var(--transition)', border: '1px solid var(--border-light)' }}
                onClick={() => setSelectedState(sb.state)}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--saffron)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: 'var(--navy-primary)', fontSize: '1.1rem' }}>{sb.state}</span>
                  <span className="badge-risk critical" style={{ fontSize: '1rem', padding: '0.3rem 0.6rem', borderRadius: '50%' }}>{sb.count}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Potential Duplicates Found</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // TABLE VIEW FOR SPECIFIC STATE
        <div className="dashboard-card">
          <h3 style={{ marginBottom: '1rem', color: 'var(--navy-primary)' }}>Duplicates in {selectedState}</h3>
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Target Project (Newly Sanctioned)</th>
                  <th>Matched Project (Historical)</th>
                  <th>Similarity Score</th>
                  <th>Constituency</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDuplicates.map((d, i) => (
                  <React.Fragment key={i}>
                    <tr onClick={() => setExpandedRow(expandedRow === i ? null : i)} style={{ cursor: 'pointer', background: expandedRow === i ? 'rgba(255, 153, 51, 0.05)' : '' }}>
                      <td style={{ whiteSpace: 'normal', minWidth: '200px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--navy-primary)', marginBottom: '0.3rem' }}>
                          <i className={`fa-solid fa-chevron-${expandedRow === i ? 'down' : 'right'}`} style={{ marginRight: '0.5rem', color: 'var(--text-muted)' }}></i>
                          {d.projectId}
                        </div>
                        <div style={{ fontSize: '0.8rem' }}>{d.projectName}</div>
                      </td>
                      <td style={{ whiteSpace: 'normal', minWidth: '200px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--navy-primary)', marginBottom: '0.3rem' }}>{d.matchedProjectId}</div>
                        <div style={{ fontSize: '0.8rem' }}>{d.matchedProjectName}</div>
                      </td>
                      <td>
                        <span className="badge-risk critical" style={{ fontSize: '0.9rem', padding: '0.3rem 0.6rem' }}>
                          {d.similarityScore}% Match
                        </span>
                      </td>
                      <td>{d.constituency}</td>
                      <td>
                        <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Review Case</button>
                      </td>
                    </tr>
                    {expandedRow === i && (
                      <tr style={{ background: '#f8fafc' }}>
                        <td colSpan="5" style={{ padding: '1.5rem', whiteSpace: 'normal' }}>
                          <h4 style={{ fontSize: '0.9rem', color: 'var(--navy-primary)', marginBottom: '0.5rem' }}>AI Interpretability</h4>
                          <div style={{ padding: '1rem', background: '#fff', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '1.5rem', fontStyle: 'italic', background: 'rgba(220, 38, 38, 0.1)', padding: '0.8rem', borderLeft: '3px solid var(--risk-critical)' }}>
                              "The NLP engine detected an <strong>{d.similarityScore}% semantic match</strong> between this newly proposed work ({d.projectId}) and a historical project ({d.matchedProjectId}). Specifically, the TF-IDF vectors of their descriptions closely mirror a project previously executed in <strong>{d.constituency}</strong>. This suggests a high probability of duplicate sanctioning or 'ghost works'."
                            </p>
                            <button className="btn-primary" style={{ background: 'var(--navy-primary)' }} onClick={(e) => {
                              e.stopPropagation();
                              setInspectData(d);
                            }}>
                              <i className="fa-solid fa-circle-info" style={{ marginRight: '0.4rem' }}></i> More Info & Deep Audit
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <InspectModal 
        isOpen={!!inspectData} 
        onClose={() => setInspectData(null)} 
        data={inspectData} 
        type="duplicate" 
      />
    </section>
  );
}

export default DuplicatesPage;
