import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/auth/refresh/`, { refresh });
          localStorage.setItem('access_token', data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return API(original);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register/', data),
  login:    (data) => API.post('/auth/login/', data),
  profile:  ()     => API.get('/auth/profile/'),
  update:   (data) => API.patch('/auth/profile/', data),
};

// ── Restaurants ───────────────────────────────────────────────────────
export const restaurantAPI = {
  list:       (params) => API.get('/restaurants/', { params }),
  detail:     (id)     => API.get(`/restaurants/${id}/`),
  categories: ()       => API.get('/restaurants/categories/'),
  create:     (data)   => API.post('/restaurants/create/', data),
  update:     (id, d)  => API.patch(`/restaurants/${id}/update/`, d),
  myList:     ()       => API.get('/restaurants/my/'),
  addReview:  (id, d)  => API.post(`/restaurants/${id}/reviews/`, d),
};

// ── Menu ─────────────────────────────────────────────────────────────
export const menuAPI = {
  list:   (params) => API.get('/menu/', { params }),
  detail: (id)     => API.get(`/menu/${id}/`),
  create: (data)   => API.post('/menu/create/', data),
  update: (id, d)  => API.patch(`/menu/${id}/edit/`, d),
  delete: (id)     => API.delete(`/menu/${id}/edit/`),
};

// ── Cart ─────────────────────────────────────────────────────────────
export const cartAPI = {
  get:        ()       => API.get('/cart/'),
  add:        (data)   => API.post('/cart/', data),
  updateItem: (id, d)  => API.patch(`/cart/${id}/`, d),
  removeItem: (id)     => API.delete(`/cart/${id}/`),
  clear:      ()       => API.delete('/cart/'),
};

// ── Orders ───────────────────────────────────────────────────────────
export const orderAPI = {
  list:            ()       => API.get('/orders/'),
  place:           (data)   => API.post('/orders/place/', data),
  detail:          (id)     => API.get(`/orders/${id}/`),
  cancel:          (id)     => API.post(`/orders/${id}/cancel/`),
  updateStatus:    (id, d)  => API.patch(`/orders/${id}/status/`, d),
  restaurantOrders: ()      => API.get('/orders/restaurant/'),
};

export default API;
