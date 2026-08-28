import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@mospi.gov.in');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message || 'Login authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: '#ffffff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', border: '1px solid rgba(255, 153, 51, 0.3)' }}>
        {/* HEADER */}
        <div style={{ background: 'var(--navy-primary)', padding: '1.75rem', textAlign: 'center', color: '#ffffff', borderBottom: '3px solid var(--saffron)' }}>
          <div className="govt-emblem-icon" style={{ width: '48px', height: '48px', fontSize: '1.5rem', margin: '0 auto 0.75rem' }}>
            <i className="fa-solid fa-landmark"></i>
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', fontWeight: 800 }}>
            MPLADS AI Portal Login
          </h2>
          <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.2rem' }}>
            Ministry of Statistics &amp; Programme Implementation · Govt of India
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && (
            <div style={{ padding: '0.75rem', background: 'var(--risk-critical-bg)', color: 'var(--risk-critical)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fa-solid fa-triangle-exclamation"></i> {error}
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-primary)', display: 'block', marginBottom: '0.35rem' }}>
              Official Email ID:
            </label>
            <div style={{ position: 'relative' }}>
              <i className="fa-solid fa-envelope" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.85rem' }}></i>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem 0.6rem 2.4rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', outline: 'none' }}
                placeholder="admin@mospi.gov.in"
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-primary)', display: 'block', marginBottom: '0.35rem' }}>
              Password:
            </label>
            <div style={{ position: 'relative' }}>
              <i className="fa-solid fa-lock" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.85rem' }}></i>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem 0.6rem 2.4rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', outline: 'none' }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div style={{ padding: '0.75rem', background: 'var(--saffron-light)', border: '1px solid rgba(255, 153, 51, 0.4)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: '#92400E' }}>
            <p style={{ fontWeight: 700, marginBottom: '0.2rem' }}>Demo Credentials:</p>
            <p>Email: <code>admin@mospi.gov.in</code> · Password: <code>any password</code></p>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', background: 'linear-gradient(135deg, var(--saffron), var(--saffron-dark))', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Command Center'}
            <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.4rem' }}></i>
          </button>
        </form>

        <div style={{ background: 'var(--ash-bg)', padding: '0.75rem', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)' }}>
          SIH 2026 PROTOTYPE · AUTHORIZED OFFICIAL PERSONNEL ONLY
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
