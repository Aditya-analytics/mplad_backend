import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';

export function WorkDetailModal({ work, isOpen, onClose }) {
  if (!isOpen || !work) return null;

  const handleIssueNotice = () => {
    alert(`Audit Notice successfully dispatched to District Collector (${work.district || 'District Administration'}).`);
  };

  const sanctionedText = typeof work.sanctionedAmount === 'number' 
    ? formatCurrency(work.sanctionedAmount) 
    : (work.sanctioned || '₹2.40 Cr');

  const spentText = typeof work.utilizedAmount === 'number' 
    ? formatCurrency(work.utilizedAmount) 
    : (work.spent || '₹2.10 Cr');

  const progressVal = work.physicalProgress !== undefined 
    ? work.physicalProgress 
    : (work.progress || 45);

  const delayVal = work.delayDays !== undefined 
    ? work.delayDays 
    : (work.delay || 74);

  const riskScore = work.riskScore !== undefined 
    ? work.riskScore 
    : (work.score || 88);

  const reasoning = work.aiRiskAnalysis?.overallAssessment || work.reasoning || 
    'High expenditure-to-physical progress mismatch. Funds released while site physical completion is lagging. Geofenced telemetry indicates timeline stalling.';

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{work.id}</div>
          <button className="modal-close-btn" onClick={onClose} title="Close Modal">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="modal-body">
          <h3 style={{ fontSize: '1.1rem', color: 'var(--navy-primary)', marginBottom: '0.4rem', fontWeight: 700 }}>
            {work.projectName || work.title}
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
            <i className="fa-solid fa-location-dot" style={{ color: 'var(--saffron)', marginRight: '0.3rem' }}></i>
            {work.district}, {work.state} · MP Constituency: {work.constituency || `${work.district} City`}
          </p>

          <div className="modal-grid-2">
            <div className="info-block">
              <div className="info-block-label">Sanctioned Amount</div>
              <div className="info-block-val">{sanctionedText}</div>
            </div>
            <div className="info-block">
              <div className="info-block-label">Total Expenditure</div>
              <div className="info-block-val">{spentText}</div>
            </div>
            <div className="info-block">
              <div className="info-block-label">Physical Progress</div>
              <div className="info-block-val">{progressVal}%</div>
            </div>
            <div className="info-block">
              <div className="info-block-label">Schedule Delay</div>
              <div className="info-block-val" style={{ color: delayVal > 60 ? 'var(--risk-critical)' : 'var(--risk-high)' }}>
                +{delayVal} Days
              </div>
            </div>
          </div>

          <div className="ai-reasoning-card">
            <div className="ai-reasoning-header">
              <i className="fa-solid fa-brain"></i> AI Anomaly Risk Analysis (Score: <span>{riskScore}</span>/100)
            </div>
            <p style={{ fontSize: '0.82rem', color: '#1E3A8A', lineHeight: 1.4 }}>
              {reasoning}
            </p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
          <button className="btn-primary" onClick={handleIssueNotice}>
            <i className="fa-solid fa-paper-plane" style={{ marginRight: '0.3rem' }}></i>
            Issue Collector Audit Notice
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkDetailModal;
