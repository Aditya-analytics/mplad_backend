import React, { useState, useEffect } from 'react';
import { citizenService, SUBMISSION_STATUS } from '../../services/citizenService';
import { ShowCauseNoticeModal } from '../../components/common/ShowCauseNoticeModal';

export function CitizenIntelligencePage() {
  const [submissions, setSubmissions] = useState([]);
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [toast, setToast] = useState('');
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeTargetData, setNoticeTargetData] = useState(null);

  // Filters state
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = () => {
    setSubmissions(citizenService.getSubmissions());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAction = (status, defaultNote) => {
    if (!activeSubmission) return;
    try {
      const updated = citizenService.updateSubmissionStatus(
        activeSubmission.id,
        status,
        adminNote || defaultNote
      );
      setActiveSubmission(updated);
      setToast(`Submission status updated to: ${status.replace('_', ' ')}`);
      setAdminNote('');
      loadData();
    } catch (err) {
      alert(err.message || 'Error updating status');
    } finally {
      setTimeout(() => setToast(''), 3500);
    }
  };

  const handleResetFilters = () => {
    setTypeFilter('ALL');
    setStatusFilter('ALL');
    setDistrictFilter('ALL');
    setSearchQuery('');
  };

  // Filter logic
  const filtered = submissions.filter((s) => {
    if (typeFilter !== 'ALL' && s.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (districtFilter !== 'ALL' && (s.district || '').toLowerCase() !== districtFilter.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        (s.id && s.id.toLowerCase().includes(q)) ||
        (s.referenceId && s.referenceId.toLowerCase().includes(q)) ||
        (s.citizenName && s.citizenName.toLowerCase().includes(q)) ||
        (s.projectTitle && s.projectTitle.toLowerCase().includes(q)) ||
        (s.content && s.content.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* HEADER */}
      <div className="dashboard-card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--saffron)' }}>
                MoSPI Executive Vigilance Desk
              </span>
              <span className="badge-risk low">Live Audit Channel</span>
            </div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-primary)', margin: 0 }}>
              Citizen Intelligence &amp; Public Grievances
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              Real-time monitoring, review, and adjudication of ground-level citizen ratings, progress evidence, and audit concerns.
            </p>
          </div>
        </div>

        {toast && (
          <div style={{ marginTop: '1rem', padding: '0.65rem 1rem', background: '#D1FAE5', color: '#065F46', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-circle-check"></i> {toast}
          </div>
        )}
      </div>

      {/* ADMINISTRATOR IDENTITY & AADHAAR AUTHENTICATION STATUS */}
      <div className="dashboard-card" style={{ padding: '1.1rem 1.5rem', background: '#F8FAFC', borderLeft: '4px solid var(--navy-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--green-light)', color: 'var(--green-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
              <i className="fa-solid fa-shield-check"></i>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Administrator Identity Status
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px' }}>
                <span>H. Pandey (Chief Administrator)</span>
                <span className="badge-risk low" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                  ✓ Aadhaar Authentication: Verified
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Identity Status: <strong>Government / Authorized Administrator Verified</strong> · Verified Date: <strong>12 Jan 2026</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Masked Aadhaar Identifier</div>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--navy-primary)', fontSize: '0.95rem', letterSpacing: '0.05em' }}>
                XXXX-XXXX-9012
              </div>
            </div>
            <div style={{ maxWidth: '240px', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.3, borderLeft: '1px solid var(--border-light)', paddingLeft: '0.75rem' }}>
              🔒 <strong>Privacy Assurance:</strong> Aadhaar information is securely masked and is not displayed or shared.
            </div>
          </div>
        </div>
      </div>

      {/* TOP KPIS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="dashboard-card" style={{ borderLeft: '4px solid var(--navy-primary)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Citizen Submissions
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-primary)', marginTop: '0.2rem' }}>
            1,248
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>+24 logged this week</div>
        </div>

        <div className="dashboard-card" style={{ borderLeft: '4px solid var(--saffron)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Pending Review
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706', marginTop: '0.2rem' }}>
            184
          </div>
          <div style={{ fontSize: '0.72rem', color: '#D97706' }}>Action required by district cell</div>
        </div>

        <div className="dashboard-card" style={{ borderLeft: '4px solid #10B981' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Verified Citizens
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
            8,642
          </div>
          <div style={{ fontSize: '0.72rem', color: '#059669' }}>Aadhaar-verified civic auditors</div>
        </div>

        <div className="dashboard-card" style={{ borderLeft: '4px solid var(--risk-critical)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Open Complaints
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--risk-critical)', marginTop: '0.2rem' }}>
            73
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--risk-critical)' }}>Under vigilance scrutiny</div>
        </div>

        <div className="dashboard-card" style={{ borderLeft: '4px solid #3B82F6' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Average Rating
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563EB', marginTop: '0.2rem' }}>
            4.1 / 5
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Across 384 verified ratings</div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="dashboard-card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--navy-primary)', display: 'block', marginBottom: '0.2rem' }}>
              Submission Type:
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="ALL">All Types</option>
              <option value="RATING">Rating</option>
              <option value="COMMENT">Comment</option>
              <option value="COMPLAINT">Complaint</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--navy-primary)', display: 'block', marginBottom: '0.2rem' }}>
              Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="ALL">All Statuses</option>
              <option value={SUBMISSION_STATUS.SUBMITTED}>Submitted</option>
              <option value={SUBMISSION_STATUS.UNDER_REVIEW}>Under Review</option>
              <option value={SUBMISSION_STATUS.APPROVED}>Approved</option>
              <option value={SUBMISSION_STATUS.REJECTED}>Rejected</option>
              <option value={SUBMISSION_STATUS.ACTION_INITIATED}>Action Initiated</option>
              <option value={SUBMISSION_STATUS.RESOLVED}>Resolved</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--navy-primary)', display: 'block', marginBottom: '0.2rem' }}>
              District:
            </label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="ALL">All Districts</option>
              <option value="Pune">Pune</option>
              <option value="Nagpur">Nagpur</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Lucknow">Lucknow</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--navy-primary)', display: 'block', marginBottom: '0.2rem' }}>
              Search:
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, citizen, project..."
              style={{ ...filterSelectStyle, width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end' }}>
            <button
              onClick={handleResetFilters}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* SUBMISSIONS TABLE */}
      <div className="dashboard-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy-primary)', margin: 0 }}>
            Citizen Submissions Ledger ({filtered.length})
          </h2>
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Citizen</th>
                <th>Type</th>
                <th>Project</th>
                <th>District</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--navy-primary)' }}>
                      {item.citizenName || 'Citizen'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: item.isVerified ? '#059669' : 'var(--text-muted)' }}>
                      {item.isVerified ? '✓ Verified Citizen' : 'Unverified'}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 6px', background: '#F1F5F9', borderRadius: 4 }}>
                      {item.type}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{item.projectTitle || item.projectId}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.categoryLabel || item.category}</div>
                  </td>
                  <td>{item.district}, {item.state}</td>
                  <td>{item.date ? new Date(item.date).toLocaleDateString('en-IN') : 'Recent'}</td>
                  <td>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: getStatusBg(item.status), color: getStatusColor(item.status) }}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-primary"
                      onClick={() => setActiveSubmission(item)}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                    >
                      Inspect &amp; Act
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT & ACTION MODAL */}
      {activeSubmission && (
        <div className="modal-overlay show" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-container" style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', background: '#fff' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--saffron)', fontFamily: 'monospace' }}>
                  {activeSubmission.referenceId || activeSubmission.id}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-primary)', margin: '0.2rem 0' }}>
                  Citizen Submission Review
                </h3>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveSubmission(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="modal-grid-2">
                <div className="info-block">
                  <div className="info-block-label">Citizen Identity</div>
                  <div className="info-block-val" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>{activeSubmission.citizenName}</span>
                    <span style={{ fontSize: '0.68rem', background: activeSubmission.isVerified ? '#D1FAE5' : '#FEF3C7', color: activeSubmission.isVerified ? '#065F46' : '#92400E', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>
                      {activeSubmission.isVerified ? '✓ Verified Citizen' : 'Unverified'}
                    </span>
                  </div>
                </div>
                <div className="info-block">
                  <div className="info-block-label">Project</div>
                  <div className="info-block-val">{activeSubmission.projectTitle}</div>
                </div>
                <div className="info-block">
                  <div className="info-block-label">District &amp; State</div>
                  <div className="info-block-val">{activeSubmission.district}, {activeSubmission.state}</div>
                </div>
                <div className="info-block">
                  <div className="info-block-label">Submission Type &amp; Category</div>
                  <div className="info-block-val">{activeSubmission.type} · {activeSubmission.category}</div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--navy-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  Citizen Description / Observation:
                </label>
                <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  {activeSubmission.content}
                </div>
              </div>

              {/* ATTACHED EVIDENCE */}
              {activeSubmission.evidence && activeSubmission.evidence.length > 0 && (
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--navy-primary)', display: 'block', marginBottom: '0.35rem' }}>
                    Attached Evidentiary Media ({activeSubmission.evidence.length}):
                  </label>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {activeSubmission.evidence.map((ev, i) => (
                      <div key={i} style={{ width: '130px', border: '1px solid var(--border-light)', borderRadius: 6, overflow: 'hidden', background: '#fff' }}>
                        {ev.url ? (
                          <img src={ev.url} alt={ev.name} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9' }}>
                            <i className="fa-solid fa-file fa-2x" style={{ color: 'var(--navy-primary)' }}></i>
                          </div>
                        )}
                        <div style={{ padding: '0.3rem 0.4rem', fontSize: '0.68rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {ev.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI CORRELATION SIGNAL */}
              <div style={{ padding: '0.85rem', background: 'var(--saffron-light)', border: '1px solid rgba(255,153,51,0.4)', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--saffron)', fontSize: '1.2rem' }}></i>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#92400E' }}>
                    AI Correlation Alert
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#92400E', marginTop: '0.1rem' }}>
                    {activeSubmission.aiCorrelation || 'Potential risk signal detected — administrative review required.'}
                  </div>
                </div>
              </div>

              {/* ADMIN NOTES */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--navy-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  Administrative Note / Direct Action Memo:
                </label>
                <input
                  type="text"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. Dispatched vigilance memo to District Magistrate..."
                  style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <button
                className="btn-secondary"
                onClick={() => handleAction(SUBMISSION_STATUS.UNDER_REVIEW, 'Marked under district review')}
                style={{ fontSize: '0.78rem' }}
              >
                Mark Under Review
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleAction(SUBMISSION_STATUS.ACTION_INITIATED, 'Statutory vigilance action initiated')}
                style={{ fontSize: '0.78rem', color: '#C2410C' }}
              >
                Escalate / Initiate Action
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleAction(SUBMISSION_STATUS.REJECTED, 'Submission rejected after initial triage')}
                style={{ fontSize: '0.78rem', color: 'var(--risk-critical)' }}
              >
                Reject
              </button>
              <button
                className="btn-primary"
                onClick={() => handleAction(SUBMISSION_STATUS.APPROVED, 'Approved by MoSPI Monitoring Officer')}
                style={{ fontSize: '0.78rem', background: '#059669', borderColor: '#059669' }}
              >
                Approve
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  setNoticeTargetData(activeSubmission);
                  setShowNoticeModal(true);
                }}
                style={{ fontSize: '0.78rem', background: 'var(--risk-critical)', borderColor: 'var(--risk-critical)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <i className="fa-solid fa-flag"></i> Issue Show-Cause Notice
              </button>
              <button
                className="btn-primary"
                onClick={() => handleAction(SUBMISSION_STATUS.RESOLVED, 'Grievance verified and marked resolved on ground')}
                style={{ fontSize: '0.78rem' }}
              >
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHOW-CAUSE NOTICE MODAL */}
      <ShowCauseNoticeModal
        isOpen={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
        targetData={noticeTargetData}
        onNoticeIssued={(notice) => {
          if (activeSubmission) {
            handleAction(
              SUBMISSION_STATUS.ACTION_INITIATED,
              `Statutory Show-Cause Notice (${notice.noticeId}) dispatched to ${notice.agency}. Response deadline: ${notice.deadline}.`
            );
          }
          setToast(`Show-Cause Notice (${notice.noticeId}) Issued Successfully.`);
          setTimeout(() => setToast(''), 4000);
        }}
      />
    </div>
  );
}

const filterSelectStyle = {
  padding: '0.45rem 0.65rem',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.8rem',
  outline: 'none',
  background: '#fff',
  fontFamily: 'inherit',
};

function getStatusBg(status) {
  switch (status) {
    case SUBMISSION_STATUS.APPROVED:
    case SUBMISSION_STATUS.RESOLVED:
      return '#D1FAE5';
    case SUBMISSION_STATUS.UNDER_REVIEW:
      return '#DBEAFE';
    case SUBMISSION_STATUS.ACTION_INITIATED:
      return '#FFEDD5';
    case SUBMISSION_STATUS.REJECTED:
      return '#FEE2E2';
    default:
      return '#FEF3C7';
  }
}

function getStatusColor(status) {
  switch (status) {
    case SUBMISSION_STATUS.APPROVED:
    case SUBMISSION_STATUS.RESOLVED:
      return '#065F46';
    case SUBMISSION_STATUS.UNDER_REVIEW:
      return '#1E40AF';
    case SUBMISSION_STATUS.ACTION_INITIATED:
      return '#C2410C';
    case SUBMISSION_STATUS.REJECTED:
      return '#991B1B';
    default:
      return '#92400E';
  }
}

export default CitizenIntelligencePage;
