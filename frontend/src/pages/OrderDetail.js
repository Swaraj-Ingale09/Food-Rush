import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiPhone, FiClock, FiX } from 'react-icons/fi';
import { orderAPI } from '../api';
import toast from 'react-hot-toast';

const STEPS = [
  { key: 'pending',    icon: '⏳', label: 'Order Placed',     desc: 'Your order has been received.' },
  { key: 'confirmed',  icon: '✅', label: 'Confirmed',         desc: 'Restaurant confirmed your order.' },
  { key: 'preparing',  icon: '🧑‍🍳', label: 'Being Prepared',   desc: 'The kitchen is working on it!' },
  { key: 'ready',      icon: '📦', label: 'Ready for Pickup', desc: 'Order packed and ready.' },
  { key: 'on_the_way', icon: '🛵', label: 'On The Way',       desc: 'Your rider is heading to you.' },
  { key: 'delivered',  icon: '🎉', label: 'Delivered!',       desc: 'Enjoy your meal!' },
];

const STATUS_ORDER = STEPS.map(s => s.key);

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    orderAPI.detail(id)
      .then(({ data }) => setOrder(data))
      .catch(() => navigate('/orders'))
      .finally(() => setLoading(false));

    // Auto-refresh every 30s for live tracking
    const interval = setInterval(() => {
      orderAPI.detail(id).then(({ data }) => setOrder(data)).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const { data } = await orderAPI.cancel(id);
      setOrder(data);
      toast.success('Order cancelled.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cannot cancel this order.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!order)  return null;

  const currentIndex = STATUS_ORDER.indexOf(order.status);
  const isCancelled  = order.status === 'cancelled';

  return (
    <div>
      <div className="page-header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Order #{order.id}</h1>
            <p>from {order.restaurant_name} · {new Date(order.created_at).toLocaleString()}</p>
          </div>
          {['pending', 'confirmed'].includes(order.status) && (
            <button onClick={handleCancel} className="btn btn-danger btn-sm" disabled={cancelling}>
              <FiX size={14} /> {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: '0 1.5rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', maxWidth: 1000, margin: '0 auto' }}>
          {/* Left */}
          <div>
            {/* Status Timeline */}
            {!isCancelled ? (
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>📍 Order Status</h3>
                <div style={{ display: 'flex', marginBottom: '1.5rem', gap: 0 }}>
                  {STEPS.map((step, i) => (
                    <div key={step.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                      {i < STEPS.length - 1 && (
                        <div style={{
                          position: 'absolute', top: 16, left: '50%', width: '100%', height: 3,
                          background: i < currentIndex ? 'var(--accent)' : 'var(--border)',
                          zIndex: 0,
                        }} />
                      )}
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%', zIndex: 1,
                        background: i < currentIndex ? 'var(--accent)' : i === currentIndex ? 'var(--primary)' : 'var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1rem',
                        boxShadow: i === currentIndex ? '0 0 0 4px rgba(255,107,53,.2)' : 'none',
                        transition: 'all .3s',
                      }}>
                        {step.icon}
                      </div>
                      <div style={{ fontSize: '.62rem', fontWeight: i === currentIndex ? 700 : 500, marginTop: '.4rem', textAlign: 'center', color: i <= currentIndex ? 'var(--text)' : 'var(--muted)', lineHeight: 1.3 }}>
                        {step.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'var(--primary-light)', borderRadius: 10, padding: '.75rem 1rem', display: 'flex', gap: '.75rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem' }}>{STEPS[currentIndex]?.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{STEPS[currentIndex]?.label}</div>
                    <div style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{STEPS[currentIndex]?.desc}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: '#fee2e2', border: '1px solid #fca5a5' }}>
                <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '2rem' }}>❌</span>
                  <div>
                    <div style={{ fontWeight: 800, color: '#9b1c1c' }}>Order Cancelled</div>
                    <div style={{ fontSize: '.85rem', color: '#7f1d1d' }}>This order has been cancelled.</div>
                  </div>
                </div>
              </div>
            )}

            {/* Items */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>🧾 Order Items</h3>
              {order.items.map(item => (
                <div key={item.id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '.75rem 0', borderBottom: '1px solid var(--border)', fontSize: '.9rem',
                }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{item.quantity}x</span> {item.name}
                    {item.special_instructions && (
                      <div style={{ fontSize: '.75rem', color: 'var(--muted)', fontStyle: 'italic', marginTop: '.1rem' }}>
                        "{item.special_instructions}"
                      </div>
                    )}
                  </div>
                  <span style={{ fontWeight: 700 }}>${parseFloat(item.subtotal).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ marginTop: '.75rem', display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.875rem', color: 'var(--muted)' }}>
                  <span>Subtotal</span><span>${parseFloat(order.subtotal).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.875rem', color: 'var(--muted)' }}>
                  <span>Delivery fee</span><span>${parseFloat(order.delivery_fee).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', borderTop: '2px solid var(--border)', paddingTop: '.5rem', marginTop: '.3rem' }}>
                  <span>Total</span><span style={{ color: 'var(--primary)' }}>${parseFloat(order.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div>
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>📍 Delivery Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem', fontSize: '.875rem' }}>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <FiMapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Address</div>
                    <div style={{ color: 'var(--muted)' }}>{order.delivery_address}, {order.delivery_city}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <FiPhone size={16} style={{ color: 'var(--primary)' }} />
                  <span>{order.delivery_phone}</span>
                </div>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <FiClock size={16} style={{ color: 'var(--primary)' }} />
                  <span>Est. delivery: <strong>{order.estimated_delivery} min</strong></span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>💳 Payment</h3>
              <div style={{ fontSize: '.875rem', display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Method</span>
                  <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{order.payment_method.replace('_', ' ')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Status</span>
                  <span className={`badge ${order.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                    {order.payment_status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
