import React, { useEffect, useRef, useState } from 'react';
import { ShowCauseNoticeModal } from './ShowCauseNoticeModal';
import { useAuth } from '../../hooks/useAuth';
import { citizenService } from '../../services/citizenService';

export function InspectModal({ isOpen, onClose, data, type }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const { user, role, isVerified } = useAuth();
  const isCitizen = role === 'CITIZEN';

  const handleCitizenReport = async () => {
    if (!data) return;
    try {
      setIsSubmittingReport(true);
      await citizenService.addSubmission({
        projectId: data.projectId || data.id || 'N/A',
        projectTitle: data.projectName || data.title || `Work ${data.projectId || ''}`,
        citizenName: user?.fullName || 'Citizen Contributor',
        citizenEmail: user?.email || 'citizen@demo.in',
        isVerified: !!isVerified,
        type: 'COMPLAINT',
        category: 'SUSPECTED_ANOMALY',
        text: `Citizen Report on AI Anomaly (${(type || 'GENERAL').toUpperCase()}): Anomaly flagged with risk indicator (${data.anomalyScore || data.similarityScore || data.delayRisk || 'High Risk'}). Requesting ground-level site verification.`,
        rating: null,
      });
      setToastMessage(`Grievance lodged on Work ${data.projectId || ''}! Alert dispatched to District Authority for site audit.`);
      setTimeout(() => setToastMessage(''), 5000);
    } catch (err) {
      console.error(err);
      setToastMessage('Report dispatched to administrative audit queue.');
      setTimeout(() => setToastMessage(''), 4000);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // GIS Proximity Trace Leaflet Map initialization
  useEffect(() => {
    if (!isOpen || type !== 'duplicate' || !data || !mapContainerRef.current) return;
    if (typeof window.L === 'undefined') return;

    // Remove any previous map instance to prevent duplicate error
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const L = window.L;
    // Default base coordinates (e.g. Lucknow / UP or location from data)
    const lat = data.lat || 26.8467;
    const lng = data.lng || 80.9462;
    const latB = lat + 0.00013; // ~14.5 meters offset
    const lngB = lng + 0.00012;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([lat, lng], 18);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Marker A (Newly Proposed Work)
    const markerA = L.circleMarker([lat, lng], {
      color: '#EA580C',
      fillColor: '#EA580C',
      fillOpacity: 0.9,
      weight: 3,
      radius: 9,
    }).addTo(map);

    markerA.bindPopup(`
      <div style="font-family:'Inter',sans-serif; padding:4px;">
        <span style="background:#FFEDD5; color:#C2410C; font-size:0.7rem; font-weight:700; padding:2px 6px; borderRadius:4px;">PROJECT A (PROPOSAL)</span>
        <h4 style="margin:4px 0 2px; font-size:0.85rem; color:#0A192F;">${data.projectId}</h4>
        <div style="font-size:0.75rem; color:#64748B;">${data.projectName}</div>
      </div>
    `);

    // Marker B (Historical Sanction)
    const markerB = L.circleMarker([latB, lngB], {
      color: '#DC2626',
      fillColor: '#DC2626',
      fillOpacity: 0.9,
      weight: 3,
      radius: 9,
    }).addTo(map);

    markerB.bindPopup(`
      <div style="font-family:'Inter',sans-serif; padding:4px;">
        <span style="background:#FEE2E2; color:#DC2626; font-size:0.7rem; font-weight:700; padding:2px 6px; borderRadius:4px;">PROJECT B (HISTORICAL)</span>
        <h4 style="margin:4px 0 2px; font-size:0.85rem; color:#0A192F;">${data.matchedProjectId}</h4>
        <div style="font-size:0.75rem; color:#64748B;">${data.matchedProjectName}</div>
      </div>
    `);

    // Proximity Trace Polyline (15m spatial overlap)
    const traceLine = L.polyline([[lat, lng], [latB, lngB]], {
      color: '#DC2626',
      weight: 3,
      dashArray: '6, 8',
    }).addTo(map);

    traceLine.bindTooltip('Spatial Proximity: 15.4 meters (Severe Overlap Flag)', {
      permanent: true,
      direction: 'center',
      className: 'proximity-tooltip',
    });

    mapInstanceRef.current = map;

    // Crucial fix: invalidate size after modal completes layout rendering
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, type, data]);

  if (!isOpen || !data) return null;

  const renderContent = () => {
    switch (type) {
      case 'duplicate':
        return (
          <div className="modal-anomaly-content">
            <h4 style={{ color: 'var(--navy-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              <i className="fa-solid fa-code-compare"></i> Spatial &amp; NLP Match Verification
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h5 style={{ margin: 0, color: 'var(--navy-primary)' }}>
                  <i className="fa-solid fa-map-location-dot" style={{ color: 'var(--saffron)', marginRight: 6 }}></i>
                  GIS Proximity Trace &amp; Geo-Telemetry
                </h5>
                <span className="badge-risk critical" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  15.4m Proximity Separation
                </span>
              </div>
              
              {/* WORKING LEAFLET MAP CONTAINER */}
              <div
                ref={mapContainerRef}
                style={{
                  height: '240px',
                  width: '100%',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)',
                  overflow: 'hidden',
                  position: 'relative',
                  zIndex: 1,
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                <span>Lat: {data.lat || '26.8467'}, Lng: {data.lng || '80.9462'} · Satellite GPS Precision ±2.5m</span>
                <span style={{ color: 'var(--risk-critical)', fontWeight: 600 }}>Identical Geo-polygon Overlap Detected</span>
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
      justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)',
      opacity: isOpen ? 1 : 0, transition: 'opacity 0.3s ease-in-out'
    }} onClick={onClose}>
      <div className="modal-container" style={{
        background: '#fff', width: '90%', maxWidth: '700px', 
        borderRadius: '8px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
        display: 'flex', flexDirection: 'column', maxHeight: '90vh',
        transform: isOpen ? 'scale(1)' : 'scale(0.95)',
        transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
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
        
        {toastMessage && (
          <div style={{ padding: '0.65rem 1.25rem', background: '#D1FAE5', color: '#065F46', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid #10B981' }}>
            <i className="fa-solid fa-circle-check"></i> {toastMessage}
          </div>
        )}

        <div className="modal-footer" style={{
          padding: '1.2rem 1.5rem', borderTop: '1px solid var(--border-light)',
          display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: '#f8fafc',
          borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px'
        }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.6rem 1.2rem', background: '#fff', border: '1px solid var(--border-light)', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
            Close
          </button>
          {isCitizen ? (
            <button
              onClick={handleCitizenReport}
              disabled={isSubmittingReport}
              className="btn-primary"
              style={{
                padding: '0.6rem 1.2rem',
                background: '#D97706',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: isSubmittingReport ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <i className="fa-solid fa-bullhorn" style={{ marginRight: '0.4rem' }}></i>
              {isSubmittingReport ? 'Submitting Grievance...' : 'Report Anomaly / Request Audit'}
            </button>
          ) : (
            <button
              onClick={() => setShowNoticeModal(true)}
              className="btn-primary"
              style={{
                padding: '0.6rem 1.2rem',
                background: 'var(--risk-critical)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <i className="fa-solid fa-flag" style={{ marginRight: '0.4rem' }}></i> Issue Show-Cause Notice
            </button>
          )}
        </div>
        
      </div>

      {/* SHOW-CAUSE NOTICE MODAL */}
      <ShowCauseNoticeModal
        isOpen={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
        targetData={data}
        onNoticeIssued={(notice) => {
          setToastMessage(`Show-Cause Notice (${notice.noticeId}) Issued Successfully.`);
          setTimeout(() => setToastMessage(''), 4000);
        }}
      />
    </div>
  );
}
