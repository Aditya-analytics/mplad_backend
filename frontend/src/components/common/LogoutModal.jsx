import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

export function LogoutModal({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleConfirmLogout = async () => {
    try {
      await logout();
      onClose();
      navigate(ROUTES.LOGIN);
    } catch (e) {
      onClose();
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Confirm Logout</div>
          <button className="modal-close-btn" onClick={onClose} title="Close Modal">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="modal-body" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <i className="fa-solid fa-circle-question" style={{ fontSize: '3rem', color: 'var(--saffron)', marginBottom: '1rem', display: 'block' }}></i>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            Are you sure you want to log out of the MPLADS Monitoring Portal?
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" style={{ background: 'var(--risk-critical)' }} onClick={handleConfirmLogout}>
            <i className="fa-solid fa-right-from-bracket" style={{ marginRight: '0.3rem' }}></i>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
