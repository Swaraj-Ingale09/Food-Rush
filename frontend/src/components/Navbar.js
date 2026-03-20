import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartSidebar from './CartSidebar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount, setIsOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? 'navbar-link active' : 'navbar-link';

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-inner">
          {/* Brand */}
          <Link to="/" className="navbar-brand">
            🍔 Food<span>Rush</span>
          </Link>

          {/* Desktop Links */}
          <div className="navbar-links">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/restaurants" className={isActive('/restaurants')}>Restaurants</Link>
            {user && <Link to="/orders" className={isActive('/orders')}>My Orders</Link>}
            {user?.role === 'restaurant_owner' && (
              <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
            )}
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            {/* Cart button */}
            <button className="cart-btn" onClick={() => setIsOpen(true)}>
              <FiShoppingCart size={18} />
              Cart
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </button>

            {user ? (
              <>
                <Link to="/profile" className="btn btn-ghost btn-sm">
                  <FiUser size={16} /> {user.username}
                </Link>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                  <FiLogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <CartSidebar />
    </>
  );
}
