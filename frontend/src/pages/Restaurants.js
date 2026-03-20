import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiStar, FiClock, FiTruck, FiFilter } from 'react-icons/fi';
import { restaurantAPI } from '../api';

function StarRating({ rating }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '.2rem' }}>
      <FiStar size={13} style={{ color: '#FBD038' }} />
      <strong>{rating}</strong>
    </span>
  );
}

function RestaurantCard({ r }) {
  return (
    <Link to={`/restaurants/${r.id}`} className="restaurant-card fade-in" style={{ textDecoration: 'none' }}>
      <div style={{ position: 'relative' }}>
        <div className="restaurant-card-img">
          {r.image
            ? <img src={r.image} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: '4rem' }}>{r.category_icon || '🍽️'}</span>
          }
        </div>
        {!r.is_open && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '.05em',
          }}>CLOSED</div>
        )}
        {r.is_featured && (
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <span className="badge badge-warning">⭐ Featured</span>
          </div>
        )}
      </div>
      <div className="restaurant-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="restaurant-card-title">{r.name}</div>
          <StarRating rating={r.rating} />
        </div>
        <div className="restaurant-card-badges" style={{ marginTop: '.4rem' }}>
          <span className="badge badge-info">{r.category_icon} {r.category_name}</span>
        </div>
        <p style={{
          fontSize: '.8rem', color: 'var(--muted)', margin: '.4rem 0',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{r.description}</p>
        <div className="restaurant-card-footer">
          <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
            <FiClock size={13} /> {r.delivery_time} min
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
            <FiTruck size={13} /> ${r.delivery_fee} delivery
          </span>
          <span style={{ color: 'var(--muted)', fontSize: '.75rem' }}>
            Min. ${r.min_order}
          </span>
        </div>
      </div>
    </Link>
  );
}

const SORT_OPTIONS = [
  { value: '',        label: 'Default' },
  { value: 'rating',  label: 'Top Rated' },
  { value: 'delivery',label: 'Fastest Delivery' },
  { value: 'fee',     label: 'Lowest Fee' },
];

export default function Restaurants() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants]   = useState([]);
  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort]                 = useState('');
  const [showOpen, setShowOpen]         = useState(false);

  const fetchRestaurants = () => {
    setLoading(true);
    const params = {};
    if (search)           params.search   = search;
    if (selectedCategory) params.category = selectedCategory;
    if (sort)             params.sort     = sort;
    restaurantAPI.list(params)
      .then(({ data }) => {
        let results = data.results || data;
        if (showOpen) results = results.filter(r => r.is_open);
        setRestaurants(results);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    restaurantAPI.categories().then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => { fetchRestaurants(); }, [selectedCategory, sort, showOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants();
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>🍽️ All Restaurants</h1>
          <p>Discover amazing food from top-rated restaurants in your area.</p>
        </div>
      </div>

      <div className="container">
        {/* Search & Filters */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
              <FiSearch size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input
                className="form-input"
                style={{ paddingLeft: '2.2rem', width: '100%' }}
                placeholder="Search restaurants or cuisines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="form-input"
              style={{ width: 'auto', minWidth: 150 }}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button type="submit" className="btn btn-primary">
              <FiFilter size={15} /> Filter
            </button>
          </form>

          {/* Category Pills */}
          <div className="filter-pills" style={{ marginTop: '1rem' }}>
            <button
              className={`pill ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >🍽️ All</button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={`pill ${selectedCategory === c.name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === c.name ? '' : c.name)}
              >
                {c.icon} {c.name}
              </button>
            ))}
            <button
              className={`pill ${showOpen ? 'active' : ''}`}
              onClick={() => setShowOpen(!showOpen)}
            >🟢 Open Now</button>
          </div>
        </div>

        {/* Results */}
        <div style={{ marginBottom: '.75rem', color: 'var(--muted)', fontSize: '.875rem' }}>
          {!loading && `${restaurants.length} restaurant${restaurants.length !== 1 ? 's' : ''} found`}
        </div>

        {loading ? (
          <div className="grid-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton" style={{ height: 200 }} />
                <div style={{ padding: '1rem' }}>
                  <div className="skeleton" style={{ height: 20, marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>No restaurants found</h3>
            <p>Try different search terms or category.</p>
          </div>
        ) : (
          <div className="grid-4" style={{ marginBottom: '3rem' }}>
            {restaurants.map((r) => <RestaurantCard key={r.id} r={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}
