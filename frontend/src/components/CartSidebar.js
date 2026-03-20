import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function CartSidebar() {
  const { cart, isOpen, setIsOpen, updateItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const items       = cart?.items || [];
  const subtotal    = parseFloat(cart?.total || 0);
  const deliveryFee = parseFloat(cart?.restaurant?.delivery_fee || 0);

  return (
    <div className="cart-overlay" onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}>
      <div className="cart-sidebar">
        {/* Header */}
        <div className="cart-sidebar-header">
          <div>
            <h2>🛒 Your Cart</h2>
            {cart?.restaurant_name && (
              <p style={{ fontSize: '.8rem', color: 'var(--muted)', marginTop: '.15rem' }}>
                from <strong>{cart.restaurant_name}</strong>
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
            {items.length > 0 && (
              <button onClick={clearCart} className="btn btn-ghost btn-sm" title="Clear cart">
                <FiTrash2 size={14} />
              </button>
            )}
            <button onClick={() => setIsOpen(false)} className="btn btn-ghost btn-sm">
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="cart-sidebar-body">
          {items.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add some delicious items to get started!</p>
            </div>
          ) : (
            items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdate={updateItem}
                onRemove={removeItem}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-sidebar-footer">
            <div className="cart-summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="cart-summary-row"><span>Delivery fee</span><span>${deliveryFee.toFixed(2)}</span></div>
            <div className="cart-summary-row total">
              <span>Total</span>
              <span>${(subtotal + deliveryFee).toFixed(2)}</span>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem', fontSize: '1rem' }}
              onClick={() => { setIsOpen(false); navigate('/checkout'); }}
            >
              <FiShoppingBag size={18} /> Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CartItemRow({ item, onUpdate, onRemove }) {
  const detail = item.menu_item_detail || {};
  return (
    <div style={{
      display: 'flex', gap: '.75rem', alignItems: 'flex-start',
      padding: '.85rem 0', borderBottom: '1px solid var(--border)',
    }}>
      <div className="menu-item-img" style={{ width: 56, height: 56, fontSize: '1.4rem', borderRadius: 8 }}>
        {detail.image
          ? <img src={detail.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
          : '🍽️'}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '.875rem' }}>{detail.name}</div>
        {item.special_instructions && (
          <div style={{ fontSize: '.72rem', color: 'var(--muted)', fontStyle: 'italic', marginTop: '.1rem' }}>
            "{item.special_instructions}"
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '.4rem' }}>
          <div className="qty-control">
            <button className="qty-btn" onClick={() => onUpdate(item.id, item.quantity - 1)}>
              <FiMinus size={12} />
            </button>
            <span className="qty-val">{item.quantity}</span>
            <button className="qty-btn" onClick={() => onUpdate(item.id, item.quantity + 1)}>
              <FiPlus size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '.9rem' }}>
              ${parseFloat(item.subtotal).toFixed(2)}
            </span>
            <button onClick={() => onRemove(item.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
              <FiX size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
