import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({
    username: user?.username || '',
    phone:    user?.phone    || '',
    address:  user?.address  || '',
    city:     user?.city     || '',
  });
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async () => {
    setLoading(true);
    try {
      await updateUser(form);
      setEditing(false);
    } catch {}
    finally { setLoading(false); }
  };

  const roleBadge = {
    customer:          { label: '🛒 Customer',          color: 'badge-info' },
    restaurant_owner:  { label: '🍳 Restaurant Owner',  color: 'badge-warning' },
    delivery_agent:    { label: '🛵 Delivery Agent',    color: 'badge-purple' },
  }[user.role] || {};

  return (
    <div>
      <div className="page-header">
        <div className="container"><h1>👤 My Profile</h1><p>Manage your account settings</p></div>
      </div>

      <div className="container" style={{ padding: '0 1.5rem 4rem', maxWidth: 700, margin: '0 auto' }}>
        {/* Profile Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem', color: '#fff', fontWeight: 800, flexShrink: 0,
              }}>
                {user.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>{user.username}</div>
                <div style={{ color: 'var(--muted)', fontSize: '.875rem' }}>{user.email}</div>
                <span className={`badge ${roleBadge.color}`} style={{ marginTop: '.3rem' }}>{roleBadge.label}</span>
              </div>
            </div>
            <button
              className={`btn ${editing ? 'btn-primary' : 'btn-outline'} btn-sm`}
              onClick={() => editing ? save() : setEditing(true)}
              disabled={loading}
            >
              {editing
                ? <><FiSave size={14} /> {loading ? 'Saving...' : 'Save Changes'}</>
                : <><FiEdit2 size={14} /> Edit Profile</>
              }
            </button>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <FiUser size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input className="form-input" style={{ width: '100%', paddingLeft: '2.25rem' }}
                  value={form.username} onChange={set('username')} disabled={!editing} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <FiMail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input className="form-input" style={{ width: '100%', paddingLeft: '2.25rem', background: '#f8f9fa' }}
                  value={user.email} disabled />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone</label>
                <div style={{ position: 'relative' }}>
                  <FiPhone size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                  <input className="form-input" style={{ width: '100%', paddingLeft: '2.25rem' }}
                    value={form.phone} onChange={set('phone')} disabled={!editing} placeholder="+1 555 0000" />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">City</label>
                <input className="form-input" style={{ width: '100%' }}
                  value={form.city} onChange={set('city')} disabled={!editing} placeholder="New York" />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Address</label>
              <div style={{ position: 'relative' }}>
                <FiMapPin size={15} style={{ position: 'absolute', left: 12, top: 16, color: 'var(--muted)' }} />
                <textarea className="form-input" style={{ width: '100%', paddingLeft: '2.25rem', minHeight: 70 }}
                  value={form.address} onChange={set('address')} disabled={!editing} placeholder="Your full address" />
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Account Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', fontSize: '.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Member since</span>
              <span>{new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Account type</span>
              <span style={{ fontWeight: 600 }}>{roleBadge.label}</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button onClick={logout} className="btn btn-danger" style={{ width: '100%' }}>
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
}
