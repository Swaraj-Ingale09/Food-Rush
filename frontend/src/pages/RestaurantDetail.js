import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiStar, FiClock, FiTruck, FiMapPin, FiPhone, FiPlus, FiMinus, FiCheck } from 'react-icons/fi';
import { restaurantAPI, menuAPI } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function StarRating({ rating, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
      <div className="stars">
        {[1,2,3,4,5].map(i => <span key={i} className={i <= Math.round(rating) ? 'star' : 'star star-empty'}>★</span>)}
      </div>
      <span style={{ fontWeight: 700 }}>{rating}</span>
      <span style={{ color: 'var(--muted)', fontSize: '.85rem' }}>({count} reviews)</span>
    </div>
  );
}

function SpiceIndicator({ level }) {
  if (!level) return null;
  const labels = ['', '🌶️ Mild', '🌶️🌶️ Medium', '🌶️🌶️🌶️ Hot', '🌶️🌶️🌶️🌶️ Extra Hot'];
  return <span className="badge badge-danger" style={{ fontSize: '.65rem' }}>{labels[level]}</span>;
}

function AddButton({ item }) {
  const { addToCart, cart, updateItem, removeItem } = useCart();
  const cartItem = cart?.items?.find(i => i.menu_item === item.id);

  if (cartItem) {
    return (
      <div className="qty-control">
        <button className="qty-btn" onClick={() => updateItem(cartItem.id, cartItem.quantity - 1)}>
          <FiMinus size={12} />
        </button>
        <span className="qty-val">{cartItem.quantity}</span>
        <button className="qty-btn" onClick={() => updateItem(cartItem.id, cartItem.quantity + 1)}>
          <FiPlus size={12} />
        </button>
      </div>
    );
  }
  return (
    <button
      className="btn btn-primary btn-sm"
      onClick={() => addToCart(item.id)}
    >
      <FiPlus size={14} /> Add
    </button>
  );
}

function MenuItem({ item }) {
  const { addToCart } = useCart();
  return (
    <div className="menu-item">
      <div className="menu-item-img">
        {item.image
          ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
          : '🍽️'
        }
      </div>
      <div className="menu-item-info">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', flexWrap: 'wrap' }}>
          <div className="menu-item-name">{item.name}</div>
          {item.is_veg && <span className="badge badge-success" style={{ fontSize: '.65rem' }}>🥦 Veg</span>}
          <SpiceIndicator level={item.spice_level} />
          {item.is_featured && <span className="badge badge-warning" style={{ fontSize: '.65rem' }}>⭐ Popular</span>}
        </div>
        <div className="menu-item-desc">{item.description}</div>
        {item.calories && (
          <div style={{ fontSize: '.72rem', color: 'var(--muted)', marginTop: '.2rem' }}>
            🔥 {item.calories} cal · ⏱ {item.prep_time} min
          </div>
        )}
        <div className="menu-item-footer">
          <div className="menu-item-price">${parseFloat(item.price).toFixed(2)}</div>
          {item.is_available ? <AddButton item={item} /> : <span className="badge badge-danger">Unavailable</span>}
        </div>
      </div>
    </div>
  );
}

function ReviewForm({ restaurantId, onSuccess }) {
  const [rating, setRating]     = useState(5);
  const [comment, setComment]   = useState('');
  const [hoveredStar, setHover] = useState(0);
  const [loading, setLoading]   = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await restaurantAPI.addReview(restaurantId, { rating, comment });
      toast.success('Review submitted!');
      setComment(''); setRating(5);
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ marginTop: '1.5rem', background: '#f8f9fa', padding: '1.25rem', borderRadius: 12 }}>
      <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>Write a Review</h4>
      <div style={{ display: 'flex', gap: '.25rem', marginBottom: '1rem' }}>
        {[1,2,3,4,5].map(i => (
          <span
            key={i}
            onClick={() => setRating(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            style={{ fontSize: '1.8rem', cursor: 'pointer', color: i <= (hoveredStar || rating) ? '#FBD038' : '#ddd', transition: 'color .1s' }}
          >★</span>
        ))}
        <span style={{ marginLeft: '.5rem', fontSize: '.875rem', color: 'var(--muted)', alignSelf: 'center' }}>
          {['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'][rating]}
        </span>
      </div>
      <textarea
        className="form-input"
        style={{ width: '100%', minHeight: 90, resize: 'vertical' }}
        placeholder="Share your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <button type="submit" className="btn btn-primary btn-sm" disabled={loading} style={{ marginTop: '.75rem' }}>
        {loading ? 'Submitting...' : '✉️ Submit Review'}
      </button>
    </form>
  );
}

export default function RestaurantDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeMenu, setActiveMenu] = useState('');
  const [loading, setLoading]       = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([
      restaurantAPI.detail(id),
      menuAPI.list({ restaurant: id }),
    ]).then(([{ data: rest }, { data: menu }]) => {
      setRestaurant(rest);
      const items = menu.results || menu;
      setMenuItems(items);
      const cats = [...new Set(items.map(i => i.category_name).filter(Boolean))];
      setCategories(cats);
      if (cats.length) setActiveMenu(cats[0]);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return (
    <div className="loading-center">
      <div className="spinner" />
      <span>Loading restaurant...</span>
    </div>
  );

  if (!restaurant) return (
    <div className="empty-state" style={{ marginTop: '4rem' }}>
      <div className="icon">😕</div>
      <h3>Restaurant not found</h3>
    </div>
  );

  const visibleItems = activeMenu
    ? menuItems.filter(i => i.category_name === activeMenu)
    : menuItems;

  return (
    <div>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        minHeight: 240, display: 'flex', alignItems: 'flex-end', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: .15,
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ff6b35' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="container" style={{ padding: '2rem 1.5rem', position: 'relative', color: '#fff', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{
              width: 90, height: 90, borderRadius: 16, background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3rem', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,.3)',
            }}>
              {restaurant.category?.icon || '🍽️'}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.5rem,4vw,2.2rem)', fontWeight: 800 }}>
                {restaurant.name}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem', marginTop: '.5rem', opacity: .85, fontSize: '.875rem' }}>
                <span><FiStar size={14} style={{ color: '#FBD038' }} /> {restaurant.rating} ({restaurant.total_reviews} reviews)</span>
                <span><FiClock size={14} /> {restaurant.delivery_time} min</span>
                <span><FiTruck size={14} /> ${restaurant.delivery_fee} delivery</span>
                <span><FiMapPin size={14} /> {restaurant.city}</span>
              </div>
            </div>
            <div>
              <span className={`badge ${restaurant.is_open ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '.8rem' }}>
                {restaurant.is_open ? '🟢 Open Now' : '🔴 Closed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: '1.5rem', maxWidth: 1100 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
          {/* Left: Menu */}
          <div>
            {/* Category Tabs */}
            {categories.length > 1 && (
              <div className="profile-tabs" style={{ marginBottom: '1.5rem' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`profile-tab ${activeMenu === cat ? 'active' : ''}`}
                    onClick={() => setActiveMenu(cat)}
                  >{cat}</button>
                ))}
              </div>
            )}

            {/* Menu Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {visibleItems.length === 0 ? (
                <div className="empty-state"><div className="icon">🍽️</div><h3>No items available</h3></div>
              ) : (
                visibleItems.map(item => <MenuItem key={item.id} item={item} />)
              )}
            </div>
          </div>

          {/* Right: Info & Reviews */}
          <div>
            {/* Info Card */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '.95rem' }}>Restaurant Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', fontSize: '.875rem' }}>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <FiMapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                  <span>{restaurant.address}, {restaurant.city}</span>
                </div>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <FiPhone size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <span>{restaurant.phone}</span>
                </div>
                <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                  <FiTruck size={16} style={{ color: 'var(--primary)' }} />
                  <span>Min. order: <strong>${restaurant.min_order}</strong></span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '.75rem', fontSize: '.95rem' }}>
                Reviews ({restaurant.reviews?.length || 0})
              </h3>
              <StarRating rating={restaurant.rating} count={restaurant.total_reviews} />

              {(restaurant.reviews || []).slice(0, 5).map((review) => (
                <div key={review.id} style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.3rem' }}>
                    <strong style={{ fontSize: '.875rem' }}>{review.user.username}</strong>
                    <div className="stars" style={{ fontSize: '.8rem' }}>
                      {[1,2,3,4,5].map(i => <span key={i} className={i <= review.rating ? 'star' : 'star star-empty'}>★</span>)}
                    </div>
                  </div>
                  <p style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{review.comment}</p>
                  <span style={{ fontSize: '.72rem', color: '#aaa' }}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}

              {user && <ReviewForm restaurantId={id} onSuccess={load} />}
              {!user && (
                <p style={{ marginTop: '1rem', fontSize: '.8rem', color: 'var(--muted)', textAlign: 'center' }}>
                  <a href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</a> to write a review
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
