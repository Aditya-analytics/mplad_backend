import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { citizenService, SUBMISSION_STATUS } from '../../services/citizenService';
import { ROUTES } from '../../constants/routes';

export function CitizenFeedbackSection({ work, onCloseParentModal }) {
  const { user, isVerified, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeForm, setActiveForm] = useState(null); // null | 'RATE' | 'COMMENT' | 'COMPLAINT'
  const [showVerificationRequired, setShowVerificationRequired] = useState(false);
  const [notice, setNotice] = useState('');

  // Approved public feedback for this project
  const [publicFeedback, setPublicFeedback] = useState([]);

  // Rating Form State
  const [ratingVal, setRatingVal] = useState(5);
  const [ratingCategory, setRatingCategory] = useState('Work Quality');

  // Comment Form State
  const [commentText, setCommentText] = useState('');
  const [commentCategory, setCommentCategory] = useState('General Feedback');

  // Complaint Form State
  const [complaintCategory, setComplaintCategory] = useState('Poor Quality');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);

  const loadPublicFeedback = async () => {
    const all = await citizenService.getSubmissions();
    const approved = all.filter(
      (s) =>
        s.projectId === (work?.id) &&
        (s.status === SUBMISSION_STATUS.APPROVED) &&
        (s.type === 'COMMENT' || s.type === 'RATING')
    );
    setPublicFeedback(approved);
  };

  useEffect(() => {
    loadPublicFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [work?.id]);

  const handleActionClick = (formType) => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    if (!isVerified) {
      setShowVerificationRequired(true);
      return;
    }
    setActiveForm(activeForm === formType ? null : formType);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setNotice('Please select an image file (JPG, PNG, or WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setNotice('Photo must be smaller than 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedFiles((files) => [...files, {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.type,
        url: reader.result,
      }]);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (index) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    await citizenService.addSubmission({
      id: `SUB-${Date.now()}`,
      referenceId: `MPL-CIT-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'RATING',
      projectId: work.id,
      projectTitle: work.projectName || work.title,
      category: ratingCategory,
      categoryLabel: ratingCategory,
      citizenName: user?.fullName || user?.name || 'Citizen Auditor',
      citizenEmail: user?.email || 'citizen@demo.in',
      isVerified: true,
      district: work.district || 'Pune',
      state: work.state || 'Maharashtra',
      date: new Date().toISOString(),
      status: SUBMISSION_STATUS.SUBMITTED,
      rating: ratingVal,
      content: `Rating: ${ratingVal} / 5 (${ratingCategory}) for ${work.projectName || work.title}`,
      evidence: attachedFiles,
      aiCorrelation: 'Baseline rating aggregated into project community score.',
      timeline: [{ step: 'Submitted', date: new Date().toISOString().replace('T', ' ').substring(0, 16), done: true, note: 'Submitted — Awaiting Review' }],
    });

    setNotice('Rating submitted successfully. Status: Submitted — Awaiting Review');
    setAttachedFiles([]);
    setActiveForm(null);
    setTimeout(() => setNotice(''), 4000);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    await citizenService.addSubmission({
      id: `SUB-${Date.now()}`,
      referenceId: `MPL-CIT-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'COMMENT',
      projectId: work.id,
      projectTitle: work.projectName || work.title,
      category: commentCategory,
      categoryLabel: commentCategory,
      citizenName: user?.fullName || user?.name || 'Citizen Auditor',
      citizenEmail: user?.email || 'citizen@demo.in',
      isVerified: true,
      district: work.district || 'Pune',
      state: work.state || 'Maharashtra',
      date: new Date().toISOString(),
      status: SUBMISSION_STATUS.SUBMITTED,
      rating: null,
      content: commentText.trim(),
      evidence: attachedFiles,
      aiCorrelation: 'Pending moderation before publication on public project ledger.',
      timeline: [{ step: 'Submitted', date: new Date().toISOString().replace('T', ' ').substring(0, 16), done: true, note: 'Submitted — Awaiting Review' }],
    });

    setNotice('Comment submitted successfully. Status: Submitted');
    setCommentText('');
    setAttachedFiles([]);
    setActiveForm(null);
    setTimeout(() => setNotice(''), 4000);
  };

  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    if (!complaintDesc.trim()) return;

    citizenService.addSubmission({
      id: `SUB-${Date.now()}`,
      referenceId: `MPL-CIT-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'COMPLAINT',
      projectId: work.id,
      projectTitle: work.projectName || work.title,
      category: complaintCategory,
      categoryLabel: `Citizen Reported Concern (${complaintCategory})`,
      citizenName: user?.fullName || user?.name || 'Citizen Auditor',
      citizenEmail: user?.email || 'citizen@demo.in',
      isVerified: true,
      district: work.district || 'Pune',
      state: work.state || 'Maharashtra',
      date: new Date().toISOString(),
      status: SUBMISSION_STATUS.SUBMITTED,
      rating: null,
      content: complaintDesc.trim(),
      evidence: attachedFiles,
      aiCorrelation: 'Potential risk signal detected — administrative review required.',
      timeline: [
        { step: 'Submitted', date: new Date().toISOString().replace('T', ' ').substring(0, 16), done: true, note: 'Submitted by citizen via MPLADS portal' },
        { step: 'Received by Administrator', date: null, done: false, note: 'Queued for MoSPI monitoring officer' },
      ],
    });

    setNotice('Citizen Reported Concern submitted successfully. Status: Submitted');
    setComplaintDesc('');
    setAttachedFiles([]);
    setActiveForm(null);
    setTimeout(() => setNotice(''), 4000);
  };

  const renderPhotoPicker = () => (
    <div>
      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
        Attach Photo Evidence (JPG, PNG, WebP; max 5 MB):
      </label>
      <label className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.6rem', fontSize: '0.72rem', cursor: 'pointer' }}>
        <i className="fa-solid fa-camera"></i> Choose Photo
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} style={{ display: 'none' }} />
      </label>
      {attachedFiles.length > 0 && (
        <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {attachedFiles.map((file, index) => (
            <div key={`${file.name}-${index}`} style={{ position: 'relative', width: '92px' }}>
              <img src={file.url} alt={file.name} style={{ width: '92px', height: '68px', objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border-light)' }} />
              <button type="button" aria-label={`Remove ${file.name}`} onClick={() => handleRemoveFile(index)} style={{ position: 'absolute', top: 2, right: 2, width: 20, height: 20, border: 0, borderRadius: '50%', background: 'rgba(15, 23, 42, 0.8)', color: '#fff', cursor: 'pointer' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.2rem' }}>
      {/* SECTION HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--navy-primary)', margin: 0 }}>
            <i className="fa-solid fa-users" style={{ color: 'var(--saffron)', marginRight: 6 }}></i>
            Citizen Feedback
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#D97706' }}>⭐ 4.1 / 5</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>· 384 verified ratings</span>
          </div>
        </div>

        {/* 3 PARTICIPATION BUTTONS */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleActionClick('RATE')}
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', background: activeForm === 'RATE' ? '#F1F5F9' : '#fff' }}
          >
            <i className="fa-regular fa-star" style={{ color: '#D97706' }}></i> Rate This Work
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleActionClick('COMMENT')}
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', background: activeForm === 'COMMENT' ? '#F1F5F9' : '#fff' }}
          >
            <i className="fa-regular fa-comment-dots" style={{ color: 'var(--navy-primary)' }}></i> Comment on This Work
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleActionClick('COMPLAINT')}
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: 'var(--risk-critical)', background: activeForm === 'COMPLAINT' ? '#FEE2E2' : '#fff' }}
          >
            <i className="fa-solid fa-triangle-exclamation"></i> Report a Concern
          </button>
        </div>
      </div>

      {notice && (
        <div style={{ padding: '0.6rem 0.85rem', background: '#D1FAE5', color: '#065F46', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <i className="fa-solid fa-circle-check"></i> {notice}
        </div>
      )}

      {/* RATING FORM */}
      {activeForm === 'RATE' && (
        <form onSubmit={handleSubmitRating} style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--navy-primary)' }}>
            Submit Citizen Project Rating
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score:</span>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setRatingVal(s)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: s <= ratingVal ? '#F59E0B' : '#CBD5E1',
                  padding: 2,
                }}
              >
                ★
              </button>
            ))}
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#D97706', marginLeft: 4 }}>
              {ratingVal} of 5 Stars
            </span>
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
              Category:
            </label>
            <select
              value={ratingCategory}
              onChange={(e) => setRatingCategory(e.target.value)}
              style={selectInputStyle}
            >
              <option value="Work Quality">Work Quality</option>
              <option value="Progress">Progress</option>
              <option value="Timeliness">Timeliness</option>
              <option value="Community Benefit">Community Benefit</option>
            </select>
          </div>

          {renderPhotoPicker()}

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={() => setActiveForm(null)} style={{ fontSize: '0.75rem' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ fontSize: '0.75rem' }}>
              Submit Rating
            </button>
          </div>
        </form>
      )}

      {/* COMMENT FORM */}
      {activeForm === 'COMMENT' && (
        <form onSubmit={handleSubmitComment} style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--navy-primary)' }}>
            Share Your Experience
          </div>
          <div>
            <textarea
              rows={3}
              required
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Describe your experience with this MPLADS project..."
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
              Category:
            </label>
            <select
              value={commentCategory}
              onChange={(e) => setCommentCategory(e.target.value)}
              style={selectInputStyle}
            >
              <option value="Work Progress">Work Progress</option>
              <option value="Work Quality">Work Quality</option>
              <option value="Community Benefit">Community Benefit</option>
              <option value="General Feedback">General Feedback</option>
            </select>
          </div>

          {renderPhotoPicker()}

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={() => setActiveForm(null)} style={{ fontSize: '0.75rem' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ fontSize: '0.75rem' }}>
              Submit Comment
            </button>
          </div>
        </form>
      )}

      {/* COMPLAINT FORM */}
      {activeForm === 'COMPLAINT' && (
        <form onSubmit={handleSubmitComplaint} style={{ background: '#FFF5F5', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--risk-critical)' }}>
            Submit Complaint / Citizen Reported Concern
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
              Concern Category:
            </label>
            <select
              value={complaintCategory}
              onChange={(e) => setComplaintCategory(e.target.value)}
              style={selectInputStyle}
            >
              <option value="Work Not Started">Work Not Started</option>
              <option value="Work Delayed">Work Delayed</option>
              <option value="Poor Quality">Poor Quality</option>
              <option value="Incomplete Work">Incomplete Work</option>
              <option value="Incorrect Project Status">Incorrect Project Status</option>
              <option value="Suspected Irregularity">Suspected Irregularity</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <textarea
              rows={3}
              required
              value={complaintDesc}
              onChange={(e) => setComplaintDesc(e.target.value)}
              placeholder="Describe on-ground observations, discrepancies, or safety hazards..."
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', outline: 'none', resize: 'vertical' }}
            />
          </div>

          {renderPhotoPicker()}

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={() => setActiveForm(null)} style={{ fontSize: '0.75rem' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ fontSize: '0.75rem', background: 'var(--risk-critical)', borderColor: 'var(--risk-critical)' }}>
              Submit Complaint
            </button>
          </div>
        </form>
      )}

      {/* PARTICIPATION RESTRICTION MODAL */}
      {showVerificationRequired && (
        <div className="modal-overlay show" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 11000 }}>
          <div className="modal-container" style={{ maxWidth: '420px', padding: '1.75rem', background: '#fff', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--saffron-light)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', margin: '0 auto 0.75rem' }}>
              <i className="fa-solid fa-user-shield"></i>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy-primary)', marginBottom: '0.4rem' }}>
              Identity Verification Required
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '1.25rem' }}>
              Please verify your identity before submitting citizen feedback, ratings, or ground-level complaints.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                className="btn-secondary"
                onClick={() => setShowVerificationRequired(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  setShowVerificationRequired(false);
                  if (onCloseParentModal) onCloseParentModal();
                  navigate(ROUTES.CITIZEN_PARTICIPATION);
                }}
              >
                Verify Identity
              </button>
            </div>
          </div>
        </div>
      )}
      {/* PUBLIC APPROVED FEEDBACK — Community Voices */}
      {publicFeedback.length > 0 && (
        <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--navy-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <i className="fa-solid fa-comment-dots" style={{ color: 'var(--saffron)' }}></i>
            Community Voices ({publicFeedback.length} approved)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {publicFeedback.slice(0, 4).map((fb) => {
              // Anonymize: show first initial + last name initial only
              const parts = (fb.citizenName || 'Citizen').split(' ');
              const anonName = parts.length >= 2
                ? `${parts[0][0]}. ${parts[parts.length - 1][0]}.`
                : parts[0];
              return (
                <div
                  key={fb.id}
                  style={{
                    padding: '0.75rem 1rem',
                    background: '#F8FAFC',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--navy-primary)' }}>{anonName}</span>
                      <span style={{ fontSize: '0.65rem', background: '#D1FAE5', color: '#065F46', padding: '1px 5px', borderRadius: 3, fontWeight: 700 }}>✓ Verified</span>
                      <span style={{ fontSize: '0.65rem', background: '#F1F5F9', color: 'var(--text-muted)', padding: '1px 5px', borderRadius: 3 }}>{fb.category}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {fb.type === 'RATING' && fb.rating && (
                        <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 800 }}>
                          {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                        </span>
                      )}
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        {fb.date ? new Date(fb.date).toLocaleDateString('en-IN') : ''}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.4 }}>
                    {fb.content}
                  </p>
                  {fb.evidence?.some((file) => file.type?.startsWith('image/')) && (
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.55rem', flexWrap: 'wrap' }}>
                      {fb.evidence.filter((file) => file.type?.startsWith('image/')).slice(0, 3).map((file, index) => (
                        <img
                          key={`${file.name}-${index}`}
                          src={file.url}
                          alt={`Evidence submitted with feedback: ${file.name}`}
                          style={{ width: '72px', height: '52px', objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border-light)' }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {publicFeedback.length > 4 && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.3rem' }}>
                +{publicFeedback.length - 4} more approved feedback entries
              </div>
            )}
          </div>
        </div>
      )}

      {/* PARTICIPATION RESTRICTION MODAL */}
    </div>
  );
}

const selectInputStyle = {
  width: '100%',
  padding: '0.4rem 0.6rem',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.78rem',
  outline: 'none',
  background: '#fff',
  fontFamily: 'inherit',
};

export default CitizenFeedbackSection;
