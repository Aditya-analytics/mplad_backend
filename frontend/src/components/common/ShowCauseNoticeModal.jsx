import React, { useState, useEffect } from 'react';
import { citizenService } from '../../services/citizenService';

export function ShowCauseNoticeModal({ isOpen, onClose, targetData, onNoticeIssued }) {
  if (!isOpen || !targetData) return null;

  // Auto-generate notice reference ID
  const [noticeId] = useState(() => `SCN-2026-${Math.floor(10000 + Math.random() * 90000)}`);
  const [previewMode, setPreviewMode] = useState(false);
  const [issuedSuccess, setIssuedSuccess] = useState(false);

  // Form State initialized from targetData
  const [projectId, setProjectId] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [agency, setAgency] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [issueType, setIssueType] = useState('');
  const [severity, setSeverity] = useState('HIGH');
  const [reason, setReason] = useState('');
  const [deadline, setDeadline] = useState('');
  const [directives, setDirectives] = useState('');
  const [evidenceSummary, setEvidenceSummary] = useState('');

  useEffect(() => {
    if (targetData) {
      const pId = targetData.projectId || targetData.id || 'MPLAD-2026-004';
      const pTitle = targetData.projectName || targetData.projectTitle || targetData.title || 'Community Development Infrastructure';
      const dist = targetData.district || 'Pune';
      const st = targetData.state || 'Maharashtra';
      const ag = targetData.vendor || targetData.agency || targetData.implementingAgency || 'Zilla Parishad Works Division';
      const cat = targetData.category || targetData.issue || targetData.title || 'Statutory Compliance / Cost Outlier';
      const sev = targetData.risk || targetData.severity || 'HIGH';

      setProjectId(pId);
      setProjectTitle(pTitle);
      setAgency(ag);
      setDistrict(dist);
      setState(st);
      setIssueType(cat);
      setSeverity(sev === 'CRITICAL' ? 'CRITICAL' : sev === 'MODERATE' ? 'MODERATE' : 'HIGH');

      // Default statutory reason based on data
      let defaultReason = '';
      if (targetData.similarityScore) {
        defaultReason = `NLP algorithmic audit flagged an identical ${targetData.similarityScore}% text and spatial duplication between project ${pId} and historical project ${targetData.matchedProjectId}. Implementing agency has not reconciled duplicate billing lines.`;
      } else if (targetData.recommendedAmount && targetData.categoryMean) {
        defaultReason = `Isolation Forest model identified an unjustified cost overrun of +₹${((targetData.recommendedAmount - targetData.categoryMean) / 100000).toFixed(1)} Lakhs over regional DSR benchmarks for identical work categories.`;
      } else if (targetData.content) {
        defaultReason = `Ground-level audit report: ${targetData.content}`;
      } else if (targetData.message) {
        defaultReason = targetData.message;
      } else {
        defaultReason = `Field milestone delay and expenditure anomaly detected under MPLADS guidelines. Physical progress does not correspond with fund disbursements.`;
      }
      setReason(defaultReason);

      // Default response deadline: 14 days from today
      const d = new Date();
      d.setDate(d.getDate() + 14);
      setDeadline(d.toISOString().split('T')[0]);

      setDirectives(`1. Cease further fund disbursements until physical verification.\n2. Submit itemized Measurement Book (MB) & contractor reconciliation.\n3. District Vigilance Officer to conduct on-site photo audit.`);
      setEvidenceSummary(targetData.aiCorrelation || (targetData.similarityScore ? `Spatial match within 15m; ${targetData.similarityScore}% description similarity` : 'Automated ML Anomaly Flag & Citizen Grievance Record'));
      setIssuedSuccess(false);
      setPreviewMode(false);
    }
  }, [targetData]);

  const handleIssueNotice = (e) => {
    e.preventDefault();

    const noticePayload = {
      noticeId,
      projectId,
      projectTitle,
      agency,
      district,
      state,
      issueType,
      severity,
      reason,
      deadline,
      directives,
      evidenceSummary,
      issuedAt: new Date().toISOString(),
      issuedBy: 'H. Pandey (Chief Administrator, MoSPI)',
    };

    // Log notification in admin notifications
    citizenService.addAdminNotification({
      id: `notif-${Date.now()}`,
      title: `Show-Cause Notice Issued: ${noticeId}`,
      message: `Statutory notice dispatched to ${agency} (${district}) for Project ${projectId}. Response deadline: ${deadline}.`,
      submissionId: targetData.id || targetData.projectId,
      timestamp: new Date().toISOString(),
      read: false,
    });

    setIssuedSuccess(true);
    if (onNoticeIssued) {
      onNoticeIssued(noticePayload);
    }

    setTimeout(() => {
      onClose();
      setIssuedSuccess(false);
    }, 2000);
  };

  return (
    <div
      className="modal-overlay show"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(10, 25, 47, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 12000,
        backdropFilter: 'blur(5px)',
      }}
      onClick={onClose}
    >
      <div
        className="modal-container"
        style={{
          background: '#ffffff',
          width: '92%',
          maxWidth: '780px',
          borderRadius: '8px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          overflow: 'hidden',
          border: '1px solid var(--border-light)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            padding: '1.2rem 1.5rem',
            background: 'var(--navy-primary)',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '3px solid var(--saffron)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255, 153, 51, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--saffron)',
                fontSize: '1.1rem',
              }}
            >
              <i className="fa-solid fa-gavel"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                Statutory Show-Cause Notice Issuance
              </h3>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Ministry of Statistics &amp; Programme Implementation · Reference: {noticeId}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="btn-secondary"
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                background: previewMode ? 'var(--saffron)' : 'rgba(255,255,255,0.1)',
                color: previewMode ? '#000' : '#fff',
                borderColor: 'rgba(255,255,255,0.2)',
                fontWeight: 600,
              }}
            >
              <i className={`fa-solid ${previewMode ? 'fa-pen-to-square' : 'fa-file-invoice'}`} style={{ marginRight: 4 }}></i>
              {previewMode ? 'Edit Notice' : 'Preview Statutory Notice'}
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '0.2rem',
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* SUCCESS BANNER */}
        {issuedSuccess && (
          <div
            style={{
              padding: '1rem',
              background: '#D1FAE5',
              color: '#065F46',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              borderBottom: '1px solid #10B981',
            }}
          >
            <i className="fa-solid fa-circle-check" style={{ fontSize: '1.4rem' }}></i>
            <div>
              <div>Show-Cause Notice Issued Successfully</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 400 }}>
                Dispatched to {agency} ({district}, {state}). Registered under ID: {noticeId}.
              </div>
            </div>
          </div>
        )}

        {/* MODAL BODY */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {!previewMode ? (
            /* FORM MODE */
            <form id="showCauseForm" onSubmit={handleIssueNotice} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Project ID:</label>
                  <input
                    type="text"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Implementing Agency / Contractor: *</label>
                  <input
                    type="text"
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Project Name:</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>District:</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>State:</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Severity Tier:</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="CRITICAL">CRITICAL (3-Day Reply)</option>
                    <option value="HIGH">HIGH (7-Day Reply)</option>
                    <option value="MODERATE">MODERATE (14-Day Reply)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Issue / Anomaly Classification:</label>
                  <input
                    type="text"
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Response Deadline: *</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Statutory Reason for Show-Cause Notice: *</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Supporting Audit Evidence / ML Flags:</label>
                <input
                  type="text"
                  value={evidenceSummary}
                  onChange={(e) => setEvidenceSummary(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Directives &amp; Mandatory Actions:</label>
                <textarea
                  rows={3}
                  value={directives}
                  onChange={(e) => setDirectives(e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
            </form>
          ) : (
            /* PREVIEW OFFICIAL NOTICE DOCUMENT */
            <div
              style={{
                background: '#FFFDF9',
                border: '2px solid #E2E8F0',
                padding: '2rem',
                borderRadius: '6px',
                fontFamily: "'Inter', serif",
                color: '#0F172A',
                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.02)',
              }}
            >
              {/* GOVT HEADER */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0F172A', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '1.8rem', color: 'var(--navy-primary)', marginBottom: '0.25rem' }}>
                  <i className="fa-solid fa-landmark"></i>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Government of India
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
                  Ministry of Statistics &amp; Programme Implementation (MoSPI)
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  MPLADS Central Vigilance &amp; Algorithmic Compliance Cell · New Delhi
                </div>
              </div>

              {/* NOTICE METADATA */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
                <div>
                  <div><strong>Notice Ref:</strong> {noticeId}</div>
                  <div><strong>Date:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                  <div><strong>Classification:</strong> <span style={{ color: severity === 'CRITICAL' ? '#DC2626' : '#D97706', fontWeight: 700 }}>{severity} RISK VIOLATION</span></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div><strong>Dispatch Mode:</strong> Direct Vigilance Intercept</div>
                  <div><strong>Mandatory Reply Due:</strong> <span style={{ color: '#DC2626', fontWeight: 700 }}>{deadline}</span></div>
                </div>
              </div>

              {/* RECIPIENT */}
              <div style={{ fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                <strong>TO:</strong><br />
                The Executive Officer / Authorised Signatory,<br />
                <strong>{agency}</strong>,<br />
                District: {district}, State: {state}.
              </div>

              {/* SUBJECT */}
              <div style={{ background: '#F1F5F9', padding: '0.75rem 1rem', borderRadius: 4, fontWeight: 700, fontSize: '0.88rem', marginBottom: '1.25rem', color: 'var(--navy-primary)', borderLeft: '4px solid var(--saffron)' }}>
                SUBJECT: STATUTORY SHOW-CAUSE NOTICE REGARDING IRREGULARITY IN WORK ID {projectId} ("{projectTitle}")
              </div>

              {/* BODY TEXT */}
              <div style={{ fontSize: '0.85rem', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'justify' }}>
                <p>
                  1. Whereas continuous algorithmic surveillance and citizen telemetry conducted under the MPLAD Scheme has identified material deviations concerning <strong>{issueType}</strong> in the execution of the subject project.
                </p>
                <p>
                  2. <strong>Audit Finding &amp; Grounds:</strong> {reason}
                </p>
                <p>
                  3. <strong>Corroborating Evidence:</strong> {evidenceSummary}
                </p>
                <p>
                  4. <strong>Directives:</strong> You are hereby called upon to show cause within the stipulated timeline why formal penal recovery proceedings and debarment under MPLADS Operational Guidelines should not be initiated. You are directed to comply with the following:
                </p>
                <pre style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: 4, border: '1px solid var(--border-light)', fontFamily: 'inherit', fontSize: '0.82rem', whiteSpace: 'pre-wrap' }}>
                  {directives}
                </pre>
                <p>
                  5. Failure to file an itemized written explanation with authenticated measurement sheets before <strong>{deadline}</strong> shall result in deemed admission of irregularity and immediate escalation to the Hon'ble District Magistrate and Central Vigilance Commission.
                </p>
              </div>

              {/* SIGNATURE */}
              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', textAlign: 'right' }}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--navy-primary)', fontWeight: 700 }}>
                    [Digitally Dispatched via MoSPI Gateway]
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--navy-primary)' }}>H. Pandey</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chief Administrator, MPLADS Infrastructure Oversight</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div
          style={{
            padding: '1rem 1.5rem',
            background: '#F8FAFC',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            Cancel
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="submit"
              form="showCauseForm"
              className="btn-primary"
              disabled={issuedSuccess}
              style={{
                fontSize: '0.85rem',
                padding: '0.5rem 1.25rem',
                background: 'var(--risk-critical)',
                borderColor: 'var(--risk-critical)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <i className="fa-solid fa-paper-plane"></i>
              {issuedSuccess ? 'Notice Dispatched...' : 'Confirm & Issue Notice'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--navy-primary)',
  display: 'block',
  marginBottom: '0.25rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.45rem 0.65rem',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.82rem',
  outline: 'none',
  background: '#ffffff',
  fontFamily: 'inherit',
};

export default ShowCauseNoticeModal;
