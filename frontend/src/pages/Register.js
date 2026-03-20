import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm]       = useState({ username: '', email: '', password: '', password2: '', phone: '', role: 'customer' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setErrors({});
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setErrors(err.response?.data || { non_field: 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (key) => errors[key] ? (
    <span style={{ color: 'var(--danger)', fontSize: '.78rem' }}>{errors[key]}</span>
  ) : null;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🍔 FoodRush</div>
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Join thousands of food lovers today!</p>

        {errors.non_field && (
          <div style={{ background: '#fee2e2', color: '#9b1c1c', padding: '.75rem 1rem', borderRadius: 10, fontSize: '.85rem', marginBottom: '1rem' }}>
            {errors.non_field}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" style={{ width: '100%' }} required
              placeholder="johndoe" value={form.username} onChange={set('username')} />
            {fieldError('username')}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" style={{ width: '100%' }} type="email" required
              placeholder="you@example.com" value={form.email} onChange={set('email')} />
            {fieldError('email')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" style={{ width: '100%' }} type="password" required minLength={6}
                placeholder="Min 6 characters" value={form.password} onChange={set('password')} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm</label>
              <input className="form-input" style={{ width: '100%' }} type="password" required
                placeholder="Repeat password" value={form.password2} onChange={set('password2')} />
            </div>
          </div>
          {fieldError('password')}
          <div className="form-group">
            <label className="form-label">Phone <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span></label>
            <input className="form-input" style={{ width: '100%' }}
              placeholder="+1 555 0000" value={form.phone} onChange={set('phone')} />
          </div>
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <select className="form-input" style={{ width: '100%' }} value={form.role} onChange={set('role')}>
              <option value="customer">🛒 Customer – Order food</option>
              <option value="restaurant_owner">🍳 Restaurant Owner – List my restaurant</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1rem', marginTop: '.5rem' }} disabled={loading}>
            {loading ? '⏳ Creating account...' : '🚀 Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
