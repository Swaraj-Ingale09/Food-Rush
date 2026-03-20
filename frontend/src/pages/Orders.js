import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiClock, FiArrowRight } from 'react-icons/fi';
import { orderAPI } from '../api';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',         color: 'badge-warning',  icon: '⏳' },
  confirmed:  { label: 'Confirmed',       color: 'badge-info',     icon: '✅' },
  preparing:  { label: 'Preparing',       color: 'badge-purple',   icon: '🧑‍🍳' },
  ready:      { label: 'Ready',           color: 'badge-success',  icon: '📦' },
  on_the_way: { label: 'On The Way',      color: 'badge-orange',   icon: '🛵' },
  delivered:  { label: 'Delivered',       color: 'badge-success',  icon: '🎉' },
  cancelled:  { label: 'Cancelled',       color: 'badge-danger',   icon: '❌' },
};

function OrderCard({ order }) {
  const cfg = STATUS_CONFIG[order.status] || {};
  return (
    <Link to={`/orders/${order.id}`} className="card fade-in" style={{
      padding: '1.25rem', textDecoration: 'none', color: 'inherit', display: 'block',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '.5rem' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '.2rem' }}>
            {order.restaurant_name}
          </div>
          <div style={{ fontSize: '.8rem', color: 'var(--muted)' }}>
            Order #{order.id} · {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
        <span className={`badge ${cfg.color}`}>{cfg.icon} {cfg.label}</span>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '.75rem', flexWrap: 'wrap', fontSize: '.85rem', color: 'var(--muted)' }}>
        <span><FiPackage size={13} /> {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
        <span><FiClock size={13} /> {new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Total: ${parseFloat(order.total).toFixed(2)}</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem', marginTop: '.6rem' }}>
        {(order.items || []).slice(0, 3).map(item => (
          <span key={item.id} className="badge badge-info">{item.quantity}x {item.name}</span>
        ))}
        {(order.items?.length || 0) > 3 && (
          <span className="badge badge-info">+{order.items.length - 3} more</span>
        )}
      </div>

      <div style={{ marginTop: '.75rem', display: 'flex', justifyContent: 'flex-end', color: 'var(--primary)', fontSize: '.85rem', fontWeight: 600 }}>
        View Details <FiArrowRight size={14} style={{ marginLeft: 4 }} />
      </div>
    </Link>
  );
}

export default function Orders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    orderAPI.list()
      .then(({ data }) => setOrders(data.results || data))
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-center"><div className="spinner" /><span>Loading orders...</span></div>
  );

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>📦 My Orders</h1>
          <p>Track all your orders in one place</p>
        </div>
      </div>

      <div className="container" style={{ padding: '0 1.5rem 4rem' }}>
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📦</div>
            <h3>No orders yet</h3>
            <p>Your order history will appear here.</p>
            <Link to="/restaurants" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Order Now
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 700, margin: '0 auto' }}>
            {orders.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>
    </div>
  );
}
