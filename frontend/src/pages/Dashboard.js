import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiStar, FiDollarSign, FiTrendingUp, FiClock, FiCheck } from 'react-icons/fi';
import { restaurantAPI, orderAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['pending', 'confirmed', 'preparing', 'ready', 'on_the_way', 'delivered'];
const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: '#f59e0b', bg: '#fef3c7' },
  confirmed:  { label: 'Confirmed', color: '#3b82f6', bg: '#dbeafe' },
  preparing:  { label: 'Preparing', color: '#8b5cf6', bg: '#ede9fe' },
  ready:      { label: 'Ready',     color: '#10b981', bg: '#d1fae5' },
  on_the_way: { label: 'On Way',    color: '#f97316', bg: '#ffedd5' },
  delivered:  { label: 'Delivered', color: '#22c55e', bg: '#dcfce7' },
  cancelled:  { label: 'Cancelled', color: '#ef4444', bg: '#fee2e2' },
};

function StatCard({ icon, label, value, color }) {
  return (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14, background: `${color}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: color, flexShrink: 0, fontSize: '1.4rem',
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>{value}</div>
        <div style={{ fontSize: '.8rem', color: 'var(--muted)', fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

function OrderRow({ order, onStatusChange }) {
  const cfg = STATUS_CONFIG[order.status] || {};
  const nextStatus = STATUS_STEPS[STATUS_STEPS.indexOf(order.status) + 1];

  return (
    <div style={{
      display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap',
      padding: '1.25rem', border: '1px solid var(--border)', borderRadius: 12,
      background: '#fff', marginBottom: '.75rem', transition: 'var(--transition)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', flexWrap: 'wrap', marginBottom: '.4rem' }}>
          <span style={{ fontWeight: 800, fontSize: '.95rem' }}>Order #{order.id}</span>
          <span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>
            {new Date(order.created_at).toLocaleString()}
          </span>
          <span style={{
            background: cfg.bg, color: cfg.color,
            padding: '.15rem .6rem', borderRadius: 50, fontSize: '.72rem', fontWeight: 700,
          }}>{cfg.label}</span>
        </div>
        <div style={{ fontSize: '.85rem', color: 'var(--muted)', marginBottom: '.4rem' }}>
          📍 {order.delivery_address}, {order.delivery_city} · 📞 {order.delivery_phone}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem' }}>
          {order.items?.map(item => (
            <span key={item.id} className="badge badge-info">{item.quantity}x {item.name}</span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '.5rem' }}>
        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary)' }}>
          ${parseFloat(order.total).toFixed(2)}
        </div>
        {nextStatus && order.status !== 'cancelled' && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onStatusChange(order.id, nextStatus)}
          >
            <FiCheck size={13} /> Mark {STATUS_CONFIG[nextStatus]?.label}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState('orders');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    Promise.all([
      restaurantAPI.myList(),
      orderAPI.restaurantOrders(),
    ]).then(([{ data: rests }, { data: ords }]) => {
      setRestaurants(rests.results || rests);
      setOrders(ords.results || ords);
    }).finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await orderAPI.updateStatus(orderId, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? data : o));
      toast.success(`Order #${orderId} → ${STATUS_CONFIG[newStatus]?.label}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update status.');
    }
  };

  // Stats
  const totalRevenue  = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + parseFloat(o.total), 0);
  const pendingCount  = orders.filter(o => ['pending', 'confirmed'].includes(o.status)).length;
  const deliveredCount= orders.filter(o => o.status === 'delivered').length;
  const avgRating     = restaurants.reduce((s, r) => s + parseFloat(r.rating || 0), 0) / (restaurants.length || 1);

  const filteredOrders = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>🍳 Restaurant Dashboard</h1>
          <p>Welcome back, {user?.username}! Manage your restaurants and orders.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '0 1.5rem 4rem' }}>
        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          <StatCard icon={<FiDollarSign />} label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} color="var(--accent)" />
          <StatCard icon={<FiPackage />}    label="Total Orders"  value={orders.length}     color="var(--primary)" />
          <StatCard icon={<FiClock />}      label="Pending Orders" value={pendingCount}      color="#f59e0b" />
          <StatCard icon={<FiStar />}       label="Avg. Rating"   value={`${avgRating.toFixed(1)}★`} color="#FBD038" />
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            📦 Orders ({orders.length})
          </button>
          <button className={`profile-tab ${activeTab === 'restaurants' ? 'active' : ''}`} onClick={() => setActiveTab('restaurants')}>
            🍽️ My Restaurants ({restaurants.length})
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {/* Status Filter */}
            <div className="filter-pills" style={{ marginBottom: '1.5rem' }}>
              {['all', ...Object.keys(STATUS_CONFIG)].map(s => (
                <button
                  key={s}
                  className={`pill ${statusFilter === s ? 'active' : ''}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s === 'all' ? '📋 All' : `${STATUS_CONFIG[s]?.label} (${orders.filter(o => o.status === s).length})`}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="empty-state">
                <div className="icon">📦</div>
                <h3>No orders found</h3>
              </div>
            ) : (
              filteredOrders.map(order => (
                <OrderRow key={order.id} order={order} onStatusChange={handleStatusChange} />
              ))
            )}
          </div>
        )}

        {/* Restaurants Tab */}
        {activeTab === 'restaurants' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <Link to="/restaurants/create" className="btn btn-primary">
                ➕ Add Restaurant
              </Link>
            </div>
            {restaurants.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🍽️</div>
                <h3>No restaurants yet</h3>
                <p>Add your first restaurant to start receiving orders.</p>
              </div>
            ) : (
              <div className="grid-3">
                {restaurants.map(r => (
                  <div key={r.id} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 800, marginBottom: '.25rem' }}>{r.name}</div>
                        <div style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{r.city}</div>
                      </div>
                      <span className={`badge ${r.is_open ? 'badge-success' : 'badge-danger'}`}>
                        {r.is_open ? '🟢 Open' : '🔴 Closed'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '.85rem', color: 'var(--muted)' }}>
                      <span>⭐ {r.rating}</span>
                      <span>({r.total_reviews} reviews)</span>
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '.5rem' }}>
                      <Link to={`/restaurants/${r.id}`} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
