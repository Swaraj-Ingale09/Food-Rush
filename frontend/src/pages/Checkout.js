import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiPhone, FiCreditCard, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../api';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { value: 'cod',    label: 'Cash on Delivery', icon: '💵' },
  { value: 'card',   label: 'Credit/Debit Card', icon: '💳' },
  { value: 'wallet', label: 'Digital Wallet',    icon: '📱' },
];

export default function Checkout() {
  const { cart, total, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]           = useState({
    delivery_address:      user?.address || '',
    delivery_city:         user?.city    || '',
    delivery_phone:        user?.phone   || '',
    payment_method:        'cod',
    special_instructions:  '',
  });
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const items = cart?.items || [];
  const deliveryFee = parseFloat(cart?.restaurant?.delivery_fee || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setErrors({});
    try {
      const { data } = await orderAPI.place(form);
      await fetchCart();
      toast.success('🎉 Order placed successfully!');
      navigate(`/orders/${data.id}`);
    } catch (err) {
      const errs = err.response?.data || {};
      setErrors(errs);
      toast.error(errs.error || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem' }}>🛒</div>
        <h2 style={{ marginTop: '1rem' }}>Your cart is empty!</h2>
        <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/restaurants')}>
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>📦 Checkout</h1>
          <p>Review your order and complete payment</p>
        </div>
      </div>

      <div className="container" style={{ padding: '0 1.5rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', maxWidth: 1000, margin: '0 auto' }}>
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Delivery Details */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                <FiMapPin style={{ color: 'var(--primary)' }} /> Delivery Details
              </h3>
              <div className="form-group">
                <label className="form-label">Delivery Address *</label>
                <textarea className="form-input" style={{ width: '100%', minHeight: 70 }} required
                  placeholder="Street address, apartment, unit..."
                  value={form.delivery_address} onChange={set('delivery_address')} />
                {errors.delivery_address && <span style={{ color: 'var(--danger)', fontSize: '.8rem' }}>{errors.delivery_address}</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input className="form-input" style={{ width: '100%' }} required
                    placeholder="New York" value={form.delivery_city} onChange={set('delivery_city')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input className="form-input" style={{ width: '100%' }} required
                    placeholder="+1 555 0000" value={form.delivery_phone} onChange={set('delivery_phone')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Special Instructions</label>
                <textarea className="form-input" style={{ width: '100%' }}
                  placeholder="Leave at door, ring bell, extra napkins..."
                  value={form.special_instructions} onChange={set('special_instructions')} />
              </div>
            </div>

            {/* Payment */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                <FiCreditCard style={{ color: 'var(--primary)' }} /> Payment Method
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                {PAYMENT_METHODS.map(m => (
                  <label key={m.value} style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.25rem', border: `2px solid ${form.payment_method === m.value ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 12, cursor: 'pointer',
                    background: form.payment_method === m.value ? 'var(--primary-light)' : '#fff',
                    transition: 'var(--transition)',
                  }}>
                    <input type="radio" name="payment" value={m.value}
                      checked={form.payment_method === m.value}
                      onChange={set('payment_method')}
                      style={{ accentColor: 'var(--primary)' }} />
                    <span style={{ fontSize: '1.4rem' }}>{m.icon}</span>
                    <span style={{ fontWeight: 600 }}>{m.label}</span>
                    {form.payment_method === m.value && (
                      <FiCheck style={{ marginLeft: 'auto', color: 'var(--primary)' }} />
                    )}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? '⏳ Placing order...' : '✅ Place Order'}
            </button>
          </form>

          {/* Order Summary */}
          <div>
            <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: 90 }}>
              <h3 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>
                📋 Order Summary
              </h3>
              <div style={{ fontWeight: 600, color: 'var(--muted)', fontSize: '.8rem', marginBottom: '.75rem' }}>
                from {cart?.restaurant_name}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '.75rem' }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.6rem', fontSize: '.875rem' }}>
                    <span>{item.quantity}x {item.menu_item_detail?.name}</span>
                    <span style={{ fontWeight: 600 }}>${parseFloat(item.subtotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '2px solid var(--border)', paddingTop: '.75rem', marginTop: '.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.875rem', marginBottom: '.5rem', color: 'var(--muted)' }}>
                  <span>Subtotal</span><span>${total.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.875rem', marginBottom: '.5rem', color: 'var(--muted)' }}>
                  <span>Delivery fee</span><span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', marginTop: '.5rem' }}>
                  <span>Total</span><span style={{ color: 'var(--primary)' }}>${(total + deliveryFee).toFixed(2)}</span>
                </div>
              </div>
              <div style={{ marginTop: '1rem', background: 'var(--primary-light)', padding: '.75rem', borderRadius: 10, fontSize: '.8rem', color: 'var(--primary)' }}>
                🕒 Estimated delivery: <strong>{cart?.restaurant?.delivery_time + 15 || 45} minutes</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
