import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { citizenService, SUBMISSION_STATUS } from '../../services/citizenService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export function CitizenParticipationPage() {
  const { user, isVerified, updateVerification } = useAuth();
  const navigate = useNavigate();

  // Active main tab: 'PROFILE' | 'VERIFY' | 'SUBMISSIONS' | 'COMPLAINTS'
  const [activeTab, setActiveTab] = useState('PROFILE');

  // Submissions sub-filter: 'ALL' | 'COMMENT' | 'RATING' | 'COMPLAINT'
  const [submissionTypeFilter, setSubmissionTypeFilter] = useState('ALL');

  // Local submissions state
  const [submissions, setSubmissions] = useState([]);

  // Verification flow state
  const [verifStep, setVerifStep] = useState(isVerified ? 3 : 1);
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [aadhaarError, setAadhaarError] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendSeconds, setResendSeconds] = useState(30);
  const [verifying, setVerifying] = useState(false);

  // Comment delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionNotice, setActionNotice] = useState('');

  const citizenEmail = user?.email || 'citizen@demo.in';

  const loadSubmissions = () => {
    const list = citizenService.getCitizenSubmissions(citizenEmail);
    setSubmissions(list);
  };

  useEffect(() => {
    loadSubmissions();
  }, [citizenEmail]);

  useEffect(() => {
    let timer;
    if (verifStep === 2 && resendSeconds > 0) {
      timer = setInterval(() => setResendSeconds((s) => s - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [verifStep, resendSeconds]);

  // Step 1: Submit Aadhaar identifier for integration verification
  const handleAadhaarContinue = (e) => {
    e.preventDefault();
    setAadhaarError('');
    const cleaned = aadhaarInput.replace(/\s+/g, '');
    if (cleaned.length !== 12 || !/^\d{12}$/.test(cleaned)) {
      setAadhaarError('12 digits required. Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    // Proceed to OTP step without storing the Aadhaar number
    setVerifStep(2);
    setResendSeconds(30);
    setOtpInput('2026'); // Integration default for testing
  };

  // Step 2: Verify OTP via authorized backend/provider callback
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setOtpError('');
    if (!otpInput || otpInput.trim().length < 4) {
      setOtpError('Please enter the verification OTP sent to your registered mobile.');
      return;
    }

    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      // Backend marks citizen verified; frontend only receives safe verification result
      updateVerification(true, {
        verificationStatus: 'VERIFIED',
        verificationDate: new Date().toISOString().split('T')[0],
      });
      setVerifStep(3);
    }, 1000);
  };

  const handleResendOtp = () => {
    if (resendSeconds > 0) return;
    setResendSeconds(30);
    setActionNotice('A new OTP has been requested from the secure provider.');
    setTimeout(() => setActionNotice(''), 4000);
  };

  // Delete comment handler
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    try {
      citizenService.deleteComment(deleteTarget.id, citizenEmail);
      setActionNotice('Comment deleted successfully.');
      loadSubmissions();
    } catch (err) {
      setActionNotice(err.message || 'Could not delete comment.');
    } finally {
      setDeleteTarget(null);
      setTimeout(() => setActionNotice(''), 4000);
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (submissionTypeFilter === 'ALL') return true;
    return s.type === submissionTypeFilter;
  });

  const complaintSubmissions = submissions.filter((s) => s.type === 'COMPLAINT');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* PAGE HEADER */}
      <div className="dashboard-card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--saffron)' }}>
                Jan-Bhagidari Citizen Portal
              </span>
              <span className={`badge-risk ${isVerified ? 'low' : 'moderate'}`}>
                {isVerified ? '✓ Verified Citizen' : 'Not Verified'}
              </span>
            </div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.35rem', fontWeight: 800, color: 'var(--navy-primary)', margin: 0 }}>
              Citizen Participation &amp; Public Audit Desk
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              Track personal project submissions, complete government identity verification, and audit public works.
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={() => navigate(ROUTES.PROJECTS)}
            style={{ fontSize: '0.82rem' }}
          >
            <i className="fa-solid fa-compass"></i> Browse &amp; Inspect Works
          </button>
        </div>

        {actionNotice && (
          <div style={{ marginTop: '1rem', padding: '0.65rem 1rem', background: '#D1FAE5', color: '#065F46', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-circle-check"></i> {actionNotice}
          </div>
        )}
      </div>

      {/* NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--border-light)', paddingBottom: '0.25rem' }}>
        <button
          onClick={() => setActiveTab('PROFILE')}
          style={tabButtonStyle(activeTab === 'PROFILE')}
        >
          <i className="fa-solid fa-user-circle"></i> My Citizen Profile
        </button>
        <button
          onClick={() => setActiveTab('VERIFY')}
          style={tabButtonStyle(activeTab === 'VERIFY')}
        >
          <i className="fa-solid fa-shield-halved"></i> Identity Verification
          {isVerified ? (
            <span style={{ marginLeft: 6, fontSize: '0.65rem', background: '#10B981', color: '#fff', padding: '1px 5px', borderRadius: 4 }}>✓</span>
          ) : (
            <span style={{ marginLeft: 6, fontSize: '0.65rem', background: 'var(--saffron)', color: '#fff', padding: '1px 5px', borderRadius: 4 }}>!</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('SUBMISSIONS')}
          style={tabButtonStyle(activeTab === 'SUBMISSIONS')}
        >
          <i className="fa-solid fa-list-check"></i> My Submissions ({submissions.length})
        </button>
        <button
          onClick={() => setActiveTab('COMPLAINTS')}
          style={tabButtonStyle(activeTab === 'COMPLAINTS')}
        >
          <i className="fa-solid fa-bullhorn"></i> My Complaints ({complaintSubmissions.length})
        </button>
      </div>

      {/* TAB 1: MY CITIZEN PROFILE */}
      {activeTab === 'PROFILE' && (
        <div className="dashboard-card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-primary)', marginBottom: '1rem' }}>
            Citizen Profile Credentials
          </h2>

          <div className="modal-grid-2" style={{ marginBottom: '1.5rem' }}>
            <div className="info-block">
              <div className="info-block-label">Citizen Name</div>
              <div className="info-block-val">{user?.fullName || user?.name || 'Citizen Auditor'}</div>
            </div>
            <div className="info-block">
              <div className="info-block-label">Registered Email</div>
              <div className="info-block-val">{user?.email || citizenEmail}</div>
            </div>
            <div className="info-block">
              <div className="info-block-label">Mobile Number</div>
              <div className="info-block-val">{user?.mobile || '9876543210'}</div>
            </div>
            <div className="info-block">
              <div className="info-block-label">Jurisdiction</div>
              <div className="info-block-val">{user?.district || 'Pune'}, {user?.state || 'Maharashtra'}</div>
            </div>
            <div className="info-block">
              <div className="info-block-label">Civic Role</div>
              <div className="info-block-val">Citizen Contributor</div>
            </div>
            <div className="info-block">
              <div className="info-block-label">Verification Status</div>
              <div className="info-block-val" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`badge-risk ${isVerified ? 'low' : 'moderate'}`}>
                  {isVerified ? '✓ VERIFIED' : 'NOT VERIFIED'}
                </span>
                {!isVerified && (
                  <button
                    className="btn-secondary"
                    onClick={() => setActiveTab('VERIFY')}
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                  >
                    Verify Identity
                  </button>
                )}
              </div>
            </div>
          </div>

          <div style={{ padding: '0.85rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <i className="fa-solid fa-lock" style={{ color: 'var(--navy-primary)', fontSize: '1.1rem' }}></i>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              🔒 <strong>Secure Verification:</strong> Your identity information is protected and is not displayed publicly on official portals.
            </span>
          </div>
        </div>
      )}

      {/* TAB 2: AADHAAR VERIFICATION FLOW */}
      {activeTab === 'VERIFY' && (
        <div className="dashboard-card" style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--saffron-light)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', margin: '0 auto 0.75rem' }}>
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy-primary)' }}>
              Verify Your Identity
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Identity verification helps ensure that citizen feedback and project complaints come from genuine participants.
            </p>
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              🔒 <strong>Secure Verification</strong> · Your identity information is protected and is not displayed publicly.
            </div>
          </div>

          {/* STEP INDICATOR */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
            <StepChip num={1} label="Identity" active={verifStep === 1} done={verifStep > 1} />
            <div style={{ width: '40px', height: '2px', background: verifStep > 1 ? '#10B981' : 'var(--border-light)' }} />
            <StepChip num={2} label="Verify OTP" active={verifStep === 2} done={verifStep > 2} />
            <div style={{ width: '40px', height: '2px', background: verifStep > 2 ? '#10B981' : 'var(--border-light)' }} />
            <StepChip num={3} label="Verified" active={verifStep === 3} done={verifStep >= 3} />
          </div>

          {/* STEP 1: IDENTITY INPUT */}
          {verifStep === 1 && (
            <form onSubmit={handleAadhaarContinue} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.3rem' }}>
                  Aadhaar Verification
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                  Enter your 12-digit Aadhaar number for integration authorization.
                </p>

                <div style={{ position: 'relative' }}>
                  <i className="fa-solid fa-id-card" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.85rem' }}></i>
                  <input
                    type="password"
                    maxLength={12}
                    value={aadhaarInput}
                    onChange={(e) => setAadhaarInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="•••• •••• ••••"
                    style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.4rem', border: `1px solid ${aadhaarError ? 'var(--risk-critical)' : 'var(--border-light)'}`, borderRadius: 'var(--radius-sm)', fontSize: '1rem', letterSpacing: '4px', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    12 digits required
                  </span>
                  <span style={{ fontSize: '0.72rem', color: aadhaarInput.length === 12 ? '#10B981' : 'var(--text-muted)' }}>
                    {aadhaarInput.length} / 12 digits
                  </span>
                </div>
                {aadhaarError && (
                  <p style={{ fontSize: '0.72rem', color: 'var(--risk-critical)', marginTop: '0.3rem' }}>
                    {aadhaarError}
                  </p>
                )}
              </div>

              <div style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-shield" style={{ marginRight: 4, color: 'var(--saffron)' }}></i>
                Your Aadhaar identifier is verified securely through authorized identity gateways and is never stored in browser memory.
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', fontSize: '0.9rem' }}
              >
                Continue <i className="fa-solid fa-arrow-right"></i>
              </button>

              <div style={{ padding: '0.6rem 0.85rem', background: '#FEF3C7', borderRadius: 'var(--radius-sm)', border: '1px solid #FDE68A', fontSize: '0.72rem', color: '#92400E', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ marginTop: '1px', flexShrink: 0 }}></i>
                <span>
                  <strong>Prototype / Simulation Mode:</strong> This is an SIH 2026 demonstration. No real UIDAI API call is made. The Aadhaar number you enter is <strong>not stored</strong> or transmitted. In production, this step would connect to the UIDAI eKYC / OTP-Auth endpoint via a secure backend proxy.
                </span>
              </div>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {verifStep === 2 && (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '0.3rem' }}>
                  Verify OTP
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  An OTP has been sent to the mobile number associated with your identity.
                </p>

                <div style={{ position: 'relative' }}>
                  <i className="fa-solid fa-key" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.85rem' }}></i>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="Enter OTP"
                    style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.4rem', border: `1px solid ${otpError ? 'var(--risk-critical)' : 'var(--border-light)'}`, borderRadius: 'var(--radius-sm)', fontSize: '1rem', letterSpacing: '4px', outline: 'none' }}
                  />
                </div>
                {otpError && (
                  <p style={{ fontSize: '0.72rem', color: 'var(--risk-critical)', marginTop: '0.3rem' }}>
                    {otpError}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {resendSeconds > 0 ? `Resend OTP in ${resendSeconds}s` : 'OTP Expired'}
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendSeconds > 0}
                  style={{ background: 'none', border: 'none', color: resendSeconds > 0 ? 'var(--text-muted)' : 'var(--navy-primary)', fontWeight: 700, fontSize: '0.78rem', cursor: resendSeconds > 0 ? 'not-allowed' : 'pointer' }}
                >
                  Resend OTP
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setVerifStep(1)}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={verifying}
                  style={{ flex: 2, justifyContent: 'center' }}
                >
                  {verifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS */}
          {verifStep === 3 && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem' }}>
                <i className="fa-solid fa-check"></i>
              </div>

              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.35rem', fontWeight: 800, color: 'var(--navy-primary)', marginBottom: '0.4rem' }}>
                Identity Verified Successfully
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700, marginBottom: '1.5rem' }}>
                ✓ Verified Citizen
              </p>

              <div style={{ background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Name</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
                      {user?.fullName || user?.name || 'Citizen Auditor'}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Verification Status</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#059669' }}>Verified</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Masked Identifier</span>
                    <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--navy-primary)', letterSpacing: '2px' }}>XXXX-XXXX-****</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Verification Date</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                      {new Date().toISOString().split('T')[0]}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Audit Privilege</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Active (Rate, Comment, Complain)</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                  className="btn-primary"
                  onClick={() => setActiveTab('SUBMISSIONS')}
                  style={{ padding: '0.65rem 1.5rem', fontSize: '0.88rem' }}
                >
                  Continue to Citizen Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MY SUBMISSIONS */}
      {activeTab === 'SUBMISSIONS' && (
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-primary)', margin: 0 }}>
              My Citizen Submissions
            </h2>

            {/* Sub-filter */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {['ALL', 'COMMENT', 'RATING', 'COMPLAINT'].map((tp) => (
                <button
                  key={tp}
                  onClick={() => setSubmissionTypeFilter(tp)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid var(--border-light)',
                    background: submissionTypeFilter === tp ? 'var(--navy-primary)' : '#fff',
                    color: submissionTypeFilter === tp ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  {tp === 'ALL' ? 'All' : tp === 'COMMENT' ? 'Comments' : tp === 'RATING' ? 'Ratings' : 'Complaints'}
                </button>
              ))}
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-folder-open fa-2x" style={{ marginBottom: '0.5rem', color: 'var(--border-light)' }}></i>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>No submissions found in this category.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    background: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--saffron)', fontFamily: 'monospace' }}>
                          {sub.referenceId || sub.id}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>•</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {sub.date ? new Date(sub.date).toLocaleDateString('en-IN') : 'Recent'}
                        </span>
                        <span style={{ fontSize: '0.72rem', padding: '2px 6px', background: '#F1F5F9', borderRadius: 4, fontWeight: 700, color: 'var(--navy-primary)' }}>
                          {sub.type}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-primary)', marginTop: '0.2rem' }}>
                        {sub.projectTitle || sub.projectId}
                      </h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <StatusBadge status={sub.status} />
                      {sub.type === 'COMMENT' && (
                        <button
                          onClick={() => setDeleteTarget(sub)}
                          className="btn-secondary"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', color: 'var(--risk-critical)' }}
                          title="Delete Comment"
                        >
                          <i className="fa-solid fa-trash"></i> Delete
                        </button>
                      )}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.4, margin: '0 0 0.5rem 0' }}>
                    {sub.content}
                  </p>

                  {sub.evidence && sub.evidence.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Evidence:</span>
                      {sub.evidence.map((ev, i) => (
                        <span key={i} style={{ fontSize: '0.72rem', background: '#F1F5F9', padding: '2px 6px', borderRadius: 4 }}>
                          <i className="fa-solid fa-paperclip" style={{ marginRight: 3 }}></i> {ev.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MY COMPLAINTS WITH TIMELINE */}
      {activeTab === 'COMPLAINTS' && (
        <div className="dashboard-card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-primary)', marginBottom: '1rem' }}>
            Complaint Tracking &amp; Status Timeline
          </h2>

          {complaintSubmissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-clipboard-check fa-2x" style={{ marginBottom: '0.5rem', color: 'var(--border-light)' }}></i>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>No grievances or complaints filed yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {complaintSubmissions.map((comp) => (
                <div
                  key={comp.id}
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    background: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--saffron)', fontFamily: 'monospace' }}>
                        {comp.referenceId}
                      </span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-primary)', margin: '0.2rem 0' }}>
                        {comp.projectTitle}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Category: <strong>{comp.category}</strong> · {comp.district}, {comp.state}
                      </span>
                    </div>
                    <StatusBadge status={comp.status} />
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {comp.content}
                  </p>

                  {/* VISUAL TIMELINE */}
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--navy-primary)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                      Status Progression:
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '2px solid var(--border-light)', marginLeft: '0.5rem' }}>
                      {(comp.timeline || [
                        { step: 'Submitted', done: true, date: comp.date },
                        { step: 'Received by Administrator', done: true },
                        { step: 'Under Review', done: comp.status !== 'SUBMITTED' },
                        { step: 'Action Initiated', done: comp.status === 'ACTION_INITIATED' || comp.status === 'RESOLVED' },
                        { step: 'Resolved', done: comp.status === 'RESOLVED' },
                      ]).map((item, idx) => (
                        <div key={idx} style={{ position: 'relative' }}>
                          <div
                            style={{
                              position: 'absolute',
                              left: '-1.35rem',
                              top: '2px',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: item.done ? '#10B981' : '#CBD5E1',
                            }}
                          />
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: item.done ? 'var(--navy-primary)' : 'var(--text-muted)' }}>
                            {item.step}
                          </div>
                          {item.note && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.note}</div>
                          )}
                          {item.date && (
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{item.date}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONFIRM COMMENT DELETION MODAL */}
      {deleteTarget && (
        <div className="modal-overlay show" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-container" style={{ maxWidth: '420px', padding: '1.5rem', background: '#fff' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-primary)', marginBottom: '0.4rem' }}>
              Delete Comment?
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              This action cannot be undone. Are you sure you wish to delete this submitted comment?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleConfirmDelete}
                style={{ background: 'var(--risk-critical)', borderColor: 'var(--risk-critical)' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepChip({ num, label, active, done }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <div
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: done ? '#10B981' : active ? 'var(--navy-primary)' : 'var(--border-light)',
          color: done || active ? '#fff' : 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 800,
        }}
      >
        {done ? '✓' : num}
      </div>
      <span style={{ fontSize: '0.78rem', fontWeight: active ? 700 : 500, color: active ? 'var(--navy-primary)' : 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  let color = 'var(--text-muted)';
  let bg = '#F1F5F9';
  let icon = 'fa-clock';
  let label = status || 'SUBMITTED';

  switch (status) {
    case SUBMISSION_STATUS.SUBMITTED:
      color = '#B45309';
      bg = '#FEF3C7';
      icon = 'fa-circle-dot';
      label = '🟡 Submitted';
      break;
    case SUBMISSION_STATUS.UNDER_REVIEW:
      color = '#1E40AF';
      bg = '#DBEAFE';
      icon = 'fa-magnifying-glass';
      label = '🔵 Under Review';
      break;
    case SUBMISSION_STATUS.APPROVED:
      color = '#065F46';
      bg = '#D1FAE5';
      icon = 'fa-check';
      label = '🟢 Approved';
      break;
    case SUBMISSION_STATUS.REJECTED:
      color = '#991B1B';
      bg = '#FEE2E2';
      icon = 'fa-xmark';
      label = '🔴 Rejected';
      break;
    case SUBMISSION_STATUS.ACTION_INITIATED:
      color = '#C2410C';
      bg = '#FFEDD5';
      icon = 'fa-arrow-trend-up';
      label = '🟠 Action Initiated';
      break;
    case SUBMISSION_STATUS.RESOLVED:
      color = '#065F46';
      bg = '#D1FAE5';
      icon = 'fa-circle-check';
      label = '🟢 Resolved';
      break;
    default:
      label = status;
  }

  return (
    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: bg, color }}>
      {label}
    </span>
  );
}

const tabButtonStyle = (isActive) => ({
  background: 'none',
  border: 'none',
  padding: '0.6rem 1rem',
  fontSize: '0.85rem',
  fontWeight: isActive ? 700 : 500,
  color: isActive ? 'var(--navy-primary)' : 'var(--text-muted)',
  borderBottom: isActive ? '3px solid var(--saffron)' : '3px solid transparent',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontFamily: 'inherit',
});

export default CitizenParticipationPage;
