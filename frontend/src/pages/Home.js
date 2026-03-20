import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiArrowRight, FiStar, FiClock, FiTruck } from 'react-icons/fi';
import { restaurantAPI } from '../api';

const FEATURES = [
  { icon: '🚀', title: 'Lightning Fast', desc: '25-40 min average delivery time to your door.' },
  { icon: '🧑‍🍳', title: 'Top Restaurants', desc: 'Curated selection of the best local restaurants.' },
  { icon: '🔒', title: 'Secure Payments', desc: 'Multiple payment methods, 100% secure checkout.' },
  { icon: '📍', title: 'Live Tracking', desc: 'Real-time order tracking from kitchen to door.' },
];

function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= Math.round(rating) ? 'star' : 'star star-empty'}>★</span>
      ))}
    </div>
  );
}

function RestaurantCard({ r }) {
  return (
    <Link to={`/restaurants/${r.id}`} className="restaurant-card fade-in">
      <div className={`restaurant-card-img ${!r.is_open ? 'closed-overlay' : ''}`}>
        {r.image
          ? <img src={r.image} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span>{r.category_icon || '🍽️'}</span>
        }
      </div>
      <div className="restaurant-card-body">
        <div className="restaurant-card-title">{r.name}</div>
        <div className="restaurant-card-badges">
          <span className="badge badge-info">{r.category_icon} {r.category_name}</span>
          {r.is_featured && <span className="badge badge-warning">⭐ Featured</span>}
          {!r.is_open && <span className="badge badge-danger">Closed</span>}
        </div>
        <p style={{ fontSize: '.8rem', color: 'var(--muted)', margin: '.25rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {r.description}
        </p>
        <div className="restaurant-card-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: '.2rem' }}>
            <FiStar size={13} style={{ color: '#FBD038' }} />
            <strong>{r.rating}</strong> ({r.total_reviews})
          </span>
          <span><FiClock size={13} /> {r.delivery_time} min</span>
          <span><FiTruck size={13} /> ${r.delivery_fee} delivery</span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [search, setSearch]           = useState('');
  const [featured, setFeatured]       = useState([]);
  const [categories, setCategories]   = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [byCategory, setByCategory]   = useState([]);
  const [loadingFeat, setLoadingFeat] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    restaurantAPI.list({ featured: 'true' })
      .then(({ data }) => setFeatured(data.results || data))
      .finally(() => setLoadingFeat(false));
    restaurantAPI.categories()
      .then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    restaurantAPI.list({ category: activeCategory })
      .then(({ data }) => setByCategory(data.results || data));
  }, [activeCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/restaurants?search=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">🔥 #1 Food Delivery App</div>
            <h1>
              Craving Something <span className="highlight">Delicious?</span>
              <br />We've Got You Covered!
            </h1>
            <p>Order from hundreds of top restaurants. Delivered hot and fast to your door.</p>

            <form className="hero-search" onSubmit={handleSearch}>
              <FiSearch size={18} style={{ color: 'var(--muted)', flexShrink: 0 }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurants, cuisines, dishes..."
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Search <FiArrowRight size={14} />
              </button>
            </form>

            <div className="hero-stats">
              <div className="hero-stat"><div className="num">500+</div><div className="label">Restaurants</div></div>
              <div className="hero-stat"><div className="num">50K+</div><div className="label">Happy Customers</div></div>
              <div className="hero-stat"><div className="num">30 min</div><div className="label">Avg. Delivery</div></div>
              <div className="hero-stat"><div className="num">4.8★</div><div className="label">App Rating</div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: '0 1.5rem' }}>
        {/* ── Categories ── */}
        {categories.length > 0 && (
          <section style={{ margin: '2.5rem 0' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Browse by Cuisine
            </h2>
            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
              <button
                className={`pill ${activeCategory === '' ? 'active' : ''}`}
                onClick={() => setActiveCategory('')}
              >
                🍽️ All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={`pill ${activeCategory === c.name ? 'active' : ''}`}
                  onClick={() => setActiveCategory(activeCategory === c.name ? '' : c.name)}
                >
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Category Results ── */}
        {activeCategory && byCategory.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              {categories.find(c => c.name === activeCategory)?.icon} {activeCategory} Restaurants
            </h2>
            <div className="grid-4">
              {byCategory.map((r) => <RestaurantCard key={r.id} r={r} />)}
            </div>
          </section>
        )}

        {/* ── Featured Restaurants ── */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>⭐ Featured Restaurants</h2>
            <Link to="/restaurants" className="btn btn-outline btn-sm">
              View All <FiArrowRight size={14} />
            </Link>
          </div>

          {loadingFeat ? (
            <div className="grid-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card">
                  <div className="skeleton" style={{ height: 200 }} />
                  <div style={{ padding: '1rem' }}>
                    <div className="skeleton" style={{ height: 20, marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 14, width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid-4">
              {featured.map((r) => <RestaurantCard key={r.id} r={r} />)}
            </div>
          )}
        </section>

        {/* ── Features ── */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>
            Why Choose FoodRush?
          </h2>
          <div className="grid-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '.4rem' }}>{f.title}</h3>
                <p style={{ fontSize: '.85rem', color: 'var(--muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
          borderRadius: 20, padding: '3rem 2.5rem', marginBottom: '3rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1.5rem', color: '#fff',
        }}>
          <div>
            <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '1.6rem', fontWeight: 800, marginBottom: '.5rem' }}>
              Hungry right now? 🍕
            </h2>
            <p style={{ opacity: .85, maxWidth: 400 }}>
              Browse hundreds of local restaurants and get food delivered in under 40 minutes.
            </p>
          </div>
          <Link to="/restaurants" className="btn" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700, fontSize: '1rem' }}>
            Order Now <FiArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
