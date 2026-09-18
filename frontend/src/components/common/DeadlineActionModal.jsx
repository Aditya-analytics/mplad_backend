import React, { useState } from 'react';
import { formatDate } from '../../utils/formatDate';

export function DeadlineActionModal({ work, deadlineLabel, isOpen, onClose, onSubmitted }) {
  const [action, setAction] = useState('PENDING');
  const [contractor, setContractor] = useState(work?.vendor || '');
  const [contractorContact, setContractorContact] = useState('');
  const [progress, setProgress] = useState(work?.physicalProgress || 0);
  const [notes, setNotes] = useState('');
  const [gps, setGps] = useState('');
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !work) return null;

  const requestGps = () => {
    if (!navigator.geolocation) {
      setGps('GPS is not supported by this browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setGps(`${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`),
      () => setGps('GPS permission was not granted')
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    onSubmitted?.({ workId: work.id, action, files, gps, notes });
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setFiles([]);
    setNotes('');
    setGps('');
    onClose();
  };

  return (
    <div className="modal-overlay show" onClick={resetAndClose}>
      <div className="modal-container deadline-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title"><i className="fa-solid fa-calendar-check"></i> Deadline response</div>
            <div className="deadline-modal-subtitle">{work.id} · {deadlineLabel}</div>
          </div>
          <button className="modal-close-btn" onClick={resetAndClose} title="Close">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {submitted ? (
          <div className="deadline-success">
            <i className="fa-solid fa-circle-check"></i>
            <h3>Evidence response saved</h3>
            <p>The update for {work.projectName} is ready for review.</p>
            <button className="btn-primary" onClick={resetAndClose}>Done</button>
          </div>
        ) : (
          <form className="modal-body deadline-form" onSubmit={handleSubmit}>
            <div className="deadline-work-summary">
              <strong>{work.projectName}</strong>
              <span>{work.district}, {work.state} · Due {formatDate(work.expectedCompletion)}</span>
            </div>

            <div className="deadline-action-tabs" role="tablist" aria-label="Work status">
              <button type="button" className={action === 'PENDING' ? 'active' : ''} onClick={() => setAction('PENDING')}>
                <i className="fa-solid fa-person-digging"></i> Work is pending
              </button>
              <button type="button" className={action === 'COMPLETED' ? 'active completed' : ''} onClick={() => setAction('COMPLETED')}>
                <i className="fa-solid fa-flag-checkered"></i> Work completed
              </button>
            </div>

            {action === 'PENDING' && (
              <div className="deadline-form-grid">
                <label>Current progress (%)
                  <input type="number" min="0" max="99" value={progress} onChange={(event) => setProgress(event.target.value)} required />
                </label>
                <label>Contractor / vendor
                  <input value={contractor} onChange={(event) => setContractor(event.target.value)} required />
                </label>
                <label>Contractor contact
                  <input value={contractorContact} onChange={(event) => setContractorContact(event.target.value)} placeholder="Phone or email" required />
                </label>
                <label>Revised completion date
                  <input type="date" required />
                </label>
              </div>
            )}

            <div className="deadline-form-grid">
              <label className="deadline-full-field">GPS location
                <div className="deadline-inline-input">
                  <input value={gps} onChange={(event) => setGps(event.target.value)} placeholder="Latitude, longitude" required />
                  <button type="button" className="btn-secondary" onClick={requestGps} title="Capture current GPS location">
                    <i className="fa-solid fa-location-crosshairs"></i>
                  </button>
                </div>
              </label>
              <label className="deadline-full-field">{action === 'COMPLETED' ? 'Completion proof' : 'Site photo / progress proof'}
                <input type="file" accept="image/*,.pdf" multiple onChange={(event) => setFiles(Array.from(event.target.files || []))} required />
                <small>Upload geotagged photos, measurement book, invoice, or other supporting proof.</small>
              </label>
              <label className="deadline-full-field">Update details
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={action === 'COMPLETED' ? 'Describe the completed work and handover evidence.' : 'Explain the blocker and the next action.'} required />
              </label>
            </div>

            <div className="modal-footer deadline-form-footer">
              <button type="button" className="btn-secondary" onClick={resetAndClose}>Cancel</button>
              <button type="submit" className="btn-primary"><i className="fa-solid fa-paper-plane"></i> Submit response</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default DeadlineActionModal;