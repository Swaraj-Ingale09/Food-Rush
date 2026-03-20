import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = await login(email, password);
      navigate(user.role === 'restaurant_owner' ? '/dashboard' : '/');
    } catch (err) {
      const msg = err.response?.data;
      setError(
        typeof msg === 'object'
          ? Object.values(msg).flat().join(' ')
          : 'Login failed. Check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🍔 FoodRush</div>
        <h2 className="auth-title">Welcome back!</h2>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        {error && (
          <div style={{
            background: '#fee2e2', color: '#9b1c1c', padding: '.75rem 1rem',
            borderRadius: 10, fontSize: '.85rem', marginBottom: '1rem',
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <div style={{ position: 'relative' }}>
              <FiMail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input
                className="form-input"
                style={{ paddingLeft: '2.25rem', width: '100%' }}
                type="email" required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input
                className="form-input"
                style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem', width: '100%' }}
                type={showPass ? 'text' : 'password'} required
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem', marginTop: '-.5rem' }}>
            <span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>
              Demo: john@example.com / test123
            </span>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1rem' }} disabled={loading}>
            {loading ? '⏳ Signing in...' : '🔑 Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign up free</Link>
        </div>

        {/* Demo credentials */}
        <div style={{ marginTop: '1.5rem', background: '#f8f9fa', borderRadius: 10, padding: '1rem', fontSize: '.8rem' }}>
          <div style={{ fontWeight: 700, marginBottom: '.4rem' }}>🎭 Demo Accounts:</div>
          <div>Customer: john@example.com / test123</div>
          <div>Owner: admin@foodrush.com / admin123</div>
        </div>
      </div>
    </div>
  );
}
