import React from 'react';

export function InspectModal({ isOpen, onClose, data, type }) {
  if (!isOpen || !data) return null;

  const renderContent = () => {
    switch (type) {
      case 'duplicate':
        return (
          <div className="modal-anomaly-content">
            <h4 style={{ color: 'var(--navy-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              <i className="fa-solid fa-code-compare"></i> Spatial & NLP Match Verification
            </h4>
            <div className="grid-1-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                <h5 style={{ margin: '0 0 0.5rem', color: 'var(--text-muted)' }}>Project A (New Proposal)</h5>
                <p style={{ margin: '0 0 4px', fontSize: '0.85rem' }}><strong>ID:</strong> {data.projectId}</p>
                <p style={{ margin: '0 0 4px', fontSize: '0.85rem' }}><strong>Desc:</strong> {data.projectName}</p>
                <p style={{ margin: '0 0 4px', fontSize: '0.85rem' }}><strong>Cost:</strong> {data.cost || '₹25 Lakhs'}</p>
                <p style={{ margin: 0, fontSize: '0.85rem' }}><strong>Vendor:</strong> {data.vendor || 'Shree Constructions'}</p>
              </div>
              <div style={{ background: 'rgba(220,38,38,0.05)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--risk-critical)' }}>
                <h5 style={{ margin: '0 0 0.5rem', color: 'var(--risk-critical)' }}>Project B (Historical Sanction)</h5>
                <p style={{ margin: '0 0 4px', fontSize: '0.85rem' }}><strong>ID:</strong> {data.matchedProjectId}</p>
                <p style={{ margin: '0 0 4px', fontSize: '0.85rem' }}><strong>Desc:</strong> {data.matchedProjectName}</p>
                <p style={{ margin: '0 0 4px', fontSize: '0.85rem' }}><strong>Cost:</strong> {data.historicalCost || '₹24.5 Lakhs'}</p>
                <p style={{ margin: 0, fontSize: '0.85rem' }}><strong>Vendor:</strong> {data.vendor || 'Shree Constructions'}</p>
              </div>
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <h5 style={{ margin: '0 0 0.5rem', color: 'var(--navy-primary)' }}><i className="fa-solid fa-map-location-dot"></i> GIS Proximity Trace</h5>
              <div style={{ height: '200px', background: '#e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                  <i className="fa-solid fa-satellite" style={{ fontSize: '2rem', color: 'var(--navy-primary)', marginBottom: '0.5rem' }}></i>
                  <p style={{ fontWeight: 600, margin: 0 }}>Coordinates overlap within 15 meters.</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Lat: 26.8467, Lng: 80.9462</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'cost':
        return (
          <div className="modal-anomaly-content">
            <h4 style={{ color: 'var(--navy-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              <i className="fa-solid fa-file-invoice-dollar"></i> Bill of Quantities vs DSR Benchmark
            </h4>
            <div style={{ padding: '1rem', background: '#fff', borderRadius: '4px', border: '1px solid var(--border-light)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span>Cement (per bag)</span>
                <span><strong style={{ color: 'var(--risk-critical)' }}>Billed: ₹450</strong> | DSR: ₹320</span>
              </div>
              <div className="progress-bar-sm" style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                <div className="progress-fill" style={{ width: '100%', height: '100%', background: 'var(--risk-critical)', borderRadius: '4px' }}></div>
              </div>
              <div className="progress-bar-sm" style={{ height: '8px', marginTop: '6px', background: '#e2e8f0', borderRadius: '4px' }}>
                <div className="progress-fill" style={{ width: '71%', height: '100%', background: 'var(--risk-moderate)', borderRadius: '4px' }}></div>
              </div>
            </div>
            <div style={{ padding: '1rem', background: '#fff', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span>Steel (per MT)</span>
                <span><strong style={{ color: 'var(--risk-high)' }}>Billed: ₹68,000</strong> | DSR: ₹52,000</span>
              </div>
              <div className="progress-bar-sm" style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                <div className="progress-fill" style={{ width: '100%', height: '100%', background: 'var(--risk-high)', borderRadius: '4px' }}></div>
              </div>
              <div className="progress-bar-sm" style={{ height: '8px', marginTop: '6px', background: '#e2e8f0', borderRadius: '4px' }}>
                <div className="progress-fill" style={{ width: '76%', height: '100%', background: 'var(--risk-moderate)', borderRadius: '4px' }}></div>
              </div>
            </div>
            
            <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-main)', background: 'rgba(234, 88, 12, 0.1)', padding: '1rem', borderRadius: '4px', borderLeft: '4px solid var(--risk-high)' }}>
              <i className="fa-solid fa-robot" style={{ marginRight: '0.5rem' }}></i> <strong>AI Insight:</strong> Vendor has a 64% probability of intentional price inflation based on historical contract executions in this district.
            </p>
          </div>
        );
      case 'delay':
        return (
          <div className="modal-anomaly-content">
            <h4 style={{ color: 'var(--navy-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              <i className="fa-solid fa-clock-rotate-left"></i> Predictive Timeline Analysis
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '1.5rem', fontStyle: 'italic', background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '4px', borderLeft: '4px solid #3B82F6' }}>
              "Similar road construction projects in this district historically take 180 days. This project is currently at {data.delayDays || data.delay || 240} days delayed. The AI predicts a final completion slippage of 45 additional days due to recent monsoon patterns and stalled fund installments."
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ margin: '0 0 1rem', color: 'var(--navy-primary)' }}>Gantt Slippage Chart</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ width: '100px', fontSize: '0.8rem', fontWeight: 600 }}>Planned</span>
                  <div style={{ flex: 1, height: '16px', background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ width: '60%', height: '100%', background: '#10B981' }}></div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ width: '100px', fontSize: '0.8rem', fontWeight: 600 }}>Actual (Delay)</span>
                  <div style={{ flex: 1, height: '16px', background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ width: '90%', height: '100%', background: 'var(--risk-critical)' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'compliance':
        return (
          <div className="modal-anomaly-content">
            <h4 style={{ color: 'var(--navy-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              <i className="fa-solid fa-gavel"></i> Regulatory Rule-Check Matrix
            </h4>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>MPLADS Guideline</th>
                  <th style={{ padding: '0.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '0.8rem 0.5rem' }}>Section 3.1: Work belongs to allowed asset type</td>
                  <td style={{ padding: '0.8rem 0.5rem' }}><span className="badge-risk critical"><i className="fa-solid fa-xmark"></i> FAILED</span></td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '0.8rem 0.5rem' }}>Section 2.4: Executed on public/government land</td>
                  <td style={{ padding: '0.8rem 0.5rem' }}><span className="badge-risk low"><i className="fa-solid fa-check"></i> PASSED</span></td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '0.8rem 0.5rem' }}>Section 4.1: MP's recommendation quota limit</td>
                  <td style={{ padding: '0.8rem 0.5rem' }}><span className="badge-risk low"><i className="fa-solid fa-check"></i> PASSED</span></td>
                </tr>
              </tbody>
            </table>
            
            <h5 style={{ margin: '0 0 0.5rem', color: 'var(--navy-primary)' }}>Digital Audit Trail</h5>
            <ul style={{ paddingLeft: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong style={{ color: 'var(--text-main)' }}>2025-06-12:</strong> Recommended by Hon'ble MP.</li>
              <li><strong style={{ color: 'var(--text-main)' }}>2025-06-20:</strong> Cleared by Nodal District Authority (Officer ID: ND-7822).</li>
              <li><strong style={{ color: 'var(--risk-critical)' }}>2025-06-25:</strong> <strong>AI ALERT:</strong> Work flagged as non-permissible structure under Section 3.1.</li>
            </ul>
          </div>
        );
      default:
        return <div>No details available.</div>;
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(10, 25, 47, 0.7)', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      <div className="modal-container" style={{
        background: '#fff', width: '90%', maxWidth: '700px', 
        borderRadius: '8px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
        display: 'flex', flexDirection: 'column', maxHeight: '90vh'
      }} onClick={e => e.stopPropagation()}>
        
        <div className="modal-header" style={{
          padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border-light)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: '#f8fafc', borderTopLeftRadius: '8px', borderTopRightRadius: '8px'
        }}>
          <h3 style={{ margin: 0, color: 'var(--navy-primary)', fontSize: '1.2rem', fontWeight: 700 }}>
            <i className="fa-solid fa-magnifying-glass" style={{ marginRight: '0.5rem' }}></i> 
            Anomaly Investigation
          </h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: '1.2rem', 
            cursor: 'pointer', color: 'var(--text-muted)', padding: '0.2rem'
          }}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <div className="modal-body" style={{ padding: '1.5rem', overflowY: 'auto' }}>
          {renderContent()}
        </div>
        
        <div className="modal-footer" style={{
          padding: '1.2rem 1.5rem', borderTop: '1px solid var(--border-light)',
          display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: '#f8fafc',
          borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px'
        }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.6rem 1.2rem', background: '#fff', border: '1px solid var(--border-light)', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
            Close
          </button>
          <button className="btn-primary" style={{ padding: '0.6rem 1.2rem', background: 'var(--risk-critical)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
            <i className="fa-solid fa-flag" style={{ marginRight: '0.4rem' }}></i> Issue Show-Cause Notice
          </button>
        </div>
        
      </div>
    </div>
  );
}
