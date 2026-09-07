import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

export function LoginPage() {
  const { isAuthenticated, login, signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get('mode') === 'signup');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setIsSignup(true);
    }
  }, [searchParams]);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    state: '',
    district: '',
  });
  const [signupErrors, setSignupErrors] = useState({});

  const handleLoginSubmit = async (e) => {
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

  const validateSignup = () => {
    const errs = {};
    if (!signupForm.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!signupForm.mobile.trim()) {
      errs.mobile = 'Mobile Number is required';
    } else if (!/^[6-9]\d{9}$/.test(signupForm.mobile.trim())) {
      errs.mobile = 'Invalid 10-digit mobile number';
    }
    if (!signupForm.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupForm.email.trim())) {
      errs.email = 'Invalid email address';
    }
    if (!signupForm.password) {
      errs.password = 'Password is required';
    } else if (signupForm.password.length < 8) {
      errs.password = 'Weak password: Minimum 8 characters required';
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setSignupErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateSignup()) return;

    setLoading(true);
    try {
      await signup(signupForm);
      setSuccessMsg('Account created successfully.');
      setEmail(signupForm.email);
      setTimeout(() => {
        setIsSignup(false);
        setSuccessMsg('Account created successfully. Please sign in.');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '460px', background: '#ffffff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', border: '1px solid rgba(255, 153, 51, 0.3)' }}>
        {/* HEADER */}
        <div style={{ background: 'var(--navy-primary)', padding: '1.75rem', textAlign: 'center', color: '#ffffff', borderBottom: '3px solid var(--saffron)' }}>
          <div className="govt-emblem-icon" style={{ width: '48px', height: '48px', fontSize: '1.5rem', margin: '0 auto 0.75rem' }}>
            <i className={`fa-solid ${isSignup ? 'fa-user-plus' : 'fa-landmark'}`}></i>
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', fontWeight: 800 }}>
            {isSignup ? 'Create Citizen Account' : 'MPLADS AI Portal Login'}
          </h2>
          <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.2rem' }}>
            Ministry of Statistics &amp; Programme Implementation · Govt of India
          </p>
        </div>

        {/* NOTICES */}
        {error && (
          <div style={{ margin: '1rem 1.75rem 0', padding: '0.75rem', background: 'var(--risk-critical-bg)', color: 'var(--risk-critical)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-triangle-exclamation"></i> {error}
          </div>
        )}

        {successMsg && (
          <div style={{ margin: '1rem 1.75rem 0', padding: '0.75rem', background: '#D1FAE5', color: '#065F46', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-circle-check"></i> {successMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {!isSignup ? (
          <form onSubmit={handleLoginSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-primary)', display: 'block', marginBottom: '0.35rem' }}>
                Email Address:
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fa-solid fa-envelope" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.85rem' }}></i>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem 0.6rem 2.4rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', outline: 'none' }}
                  placeholder="admin@mospi.gov.in or citizen@demo.in"
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
              <p>• Admin: <code>admin@mospi.gov.in</code> (H. Pandey)</p>
              <p>• Citizen: <code>citizen@demo.in</code> (Unverified) / <code>verified@demo.in</code></p>
              <p>• Password: <code>any password</code></p>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', background: 'linear-gradient(135deg, var(--saffron), var(--saffron-dark))', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In to Platform'}
              <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.4rem' }}></i>
            </button>

            {/* SIGN UP TOGGLE DIRECTLY BELOW LOGIN BUTTON */}
            <div style={{ textAlign: 'center', marginTop: '0.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Don't have an account?{' '}
              </span>
              <button
                type="button"
                onClick={() => { setIsSignup(true); setError(''); setSuccessMsg(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--navy-primary)',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                  fontFamily: 'inherit',
                }}
              >
                Sign Up
              </button>
            </div>
          </form>
        ) : (
          /* SIGNUP FORM */
          <form onSubmit={handleSignupSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }} noValidate>
            <div>
              <label style={labelStyle}>Full Name: *</label>
              <input
                type="text"
                value={signupForm.fullName}
                onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                placeholder="Full Name as per records"
                style={inputStyle(signupErrors.fullName)}
              />
              {signupErrors.fullName && <p style={errorStyle}>{signupErrors.fullName}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Mobile Number: *</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={signupForm.mobile}
                  onChange={(e) => setSignupForm({ ...signupForm, mobile: e.target.value.replace(/\D/g, '') })}
                  placeholder="10-digit mobile"
                  style={inputStyle(signupErrors.mobile)}
                />
                {signupErrors.mobile && <p style={errorStyle}>{signupErrors.mobile}</p>}
              </div>

              <div>
                <label style={labelStyle}>Email Address: *</label>
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  placeholder="name@domain.com"
                  style={inputStyle(signupErrors.email)}
                />
                {signupErrors.email && <p style={errorStyle}>{signupErrors.email}</p>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Password: *</label>
                <input
                  type="password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  placeholder="Min 8 characters"
                  style={inputStyle(signupErrors.password)}
                />
                {signupErrors.password && <p style={errorStyle}>{signupErrors.password}</p>}
              </div>

              <div>
                <label style={labelStyle}>Confirm Password: *</label>
                <input
                  type="password"
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  style={inputStyle(signupErrors.confirmPassword)}
                />
                {signupErrors.confirmPassword && <p style={errorStyle}>{signupErrors.confirmPassword}</p>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>State: (Optional)</label>
                <input
                  type="text"
                  value={signupForm.state}
                  onChange={(e) => setSignupForm({ ...signupForm, state: e.target.value })}
                  placeholder="e.g. Maharashtra"
                  style={inputStyle()}
                />
              </div>

              <div>
                <label style={labelStyle}>District: (Optional)</label>
                <input
                  type="text"
                  value={signupForm.district}
                  onChange={(e) => setSignupForm({ ...signupForm, district: e.target.value })}
                  placeholder="e.g. Pune"
                  style={inputStyle()}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: '0.4rem', padding: '0.75rem', justifyContent: 'center', background: 'linear-gradient(135deg, var(--saffron), var(--saffron-dark))', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Already have an account?{' '}
              </span>
              <button
                type="button"
                onClick={() => { setIsSignup(false); setError(''); setSuccessMsg(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--navy-primary)',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                  fontFamily: 'inherit',
                }}
              >
                Login
              </button>
            </div>
          </form>
        )}

        <div style={{ background: 'var(--ash-bg)', padding: '0.75rem', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)' }}>
          SIH 2026 PROTOTYPE · CITIZEN TRANSPARENCY &amp; AUDIT SYSTEM
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: '0.78rem',
  fontWeight: 700,
  color: 'var(--navy-primary)',
  display: 'block',
  marginBottom: '0.25rem',
};

const inputStyle = (hasError) => ({
  width: '100%',
  padding: '0.55rem 0.75rem',
  border: `1px solid ${hasError ? 'var(--risk-critical)' : 'var(--border-light)'}`,
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.82rem',
  outline: 'none',
  fontFamily: 'inherit',
});

const errorStyle = {
  fontSize: '0.7rem',
  color: 'var(--risk-critical)',
  marginTop: '0.2rem',
};

export default LoginPage;

