import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">🍔 FoodRush</div>
            <p className="footer-desc">
              The fastest food delivery platform. Order from the best local restaurants and get your food delivered hot and fresh.
            </p>
            <div style={{ display: 'flex', gap: '.75rem', marginTop: '1rem' }}>
              {['𝕏', '📘', '📷', '💼'].map((icon, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none', fontSize: '1rem', transition: 'var(--transition)',
                }}>{icon}</a>
              ))}
            </div>
          </div>

          <div>
            <div className="footer-title">Company</div>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-title">For You</div>
            <ul className="footer-links">
              <li><Link to="/restaurants">Browse Restaurants</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/profile">Account</Link></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-title">Restaurant Partners</div>
            <ul className="footer-links">
              <li><Link to="/register">Partner With Us</Link></li>
              <li><Link to="/dashboard">Restaurant Dashboard</Link></li>
              <li><a href="#">Marketing Tools</a></li>
              <li><a href="#">Business Insights</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} FoodRush. All rights reserved. Built with ❤️ for food lovers.</p>
        </div>
      </div>
    </footer>
  );
}
