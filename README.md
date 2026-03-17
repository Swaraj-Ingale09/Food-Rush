# 🍔 FoodRush — Sophisticated Food Delivery Web App

## 🌐 Live URLs
| Service  | URL |
|----------|-----|
| **Frontend (React)** | https://3000-i79wqgbtzq90y3433g7eq-de59bda9.sandbox.novita.ai |
| **Backend API (Django)** | https://8000-i79wqgbtzq90y3433g7eq-de59bda9.sandbox.novita.ai |
| **Django Admin** | https://8000-i79wqgbtzq90y3433g7eq-de59bda9.sandbox.novita.ai/admin/ |

## 🎭 Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Customer | john@example.com | test123 |
| Restaurant Owner | admin@foodrush.com | admin123 |

---

## ✅ Implemented Features

### 🔐 Authentication
- JWT-based login & registration (`djangorestframework-simplejwt`)
- Auto token refresh on expiry
- Role-based access: Customer / Restaurant Owner / Delivery Agent
- Protected routes in React

### 🏪 Restaurants
- Browse all restaurants with search, filter by cuisine, sort by rating/delivery time/fee
- Category filter pills (Pizza, Burger, Sushi, Indian, Chinese, Mexican, Desserts, Healthy, BBQ, Seafood)
- "Open Now" filter
- Featured restaurants highlight
- Detailed restaurant page with full menu and reviews

### 🍽️ Menu
- Items grouped by category with tab navigation
- Vegetarian badge, spice level indicator, calorie count
- Add to cart with quantity control inline
- Featured/popular item highlight

### 🛒 Cart
- Slide-in cart sidebar from any page
- Add from different restaurants (auto-clears previous restaurant's cart)
- Quantity update / remove per item
- Real-time subtotal + delivery fee + total
- Special instructions per item

### 📦 Orders
- Full checkout flow with delivery address, phone, payment method selection
- Order placed → snapshots menu items (prices preserved)
- Live order tracking timeline (Pending → Confirmed → Preparing → Ready → On The Way → Delivered)
- Auto-refreshes every 30 seconds
- Cancel order (only Pending/Confirmed)
- Full order history

### ⭐ Reviews
- Star rating (1-5) with hover effect
- Comment submission
- Auto-recalculates restaurant rating after each review

### 🍳 Restaurant Owner Dashboard
- Revenue, total orders, pending orders, average rating stats
- Order management with one-click status advancement
- Filter orders by status (Pending, Confirmed, Preparing, Ready, On The Way, Delivered)
- My Restaurants listing

### 👤 Profile
- View and edit username, phone, address, city
- Role badge display
- Logout

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js 18, React Router v6, Axios, react-hot-toast, react-icons |
| **Backend** | Django 6, Django REST Framework 3.16 |
| **Auth** | JWT (djangorestframework-simplejwt) |
| **Database** | SQLite (db.sqlite3) |
| **CORS** | django-cors-headers |
| **Process Manager** | PM2 |

---

## 📁 Project Structure

```
/home/user/
├── foodrush/                   # Django backend
│   ├── core/                   # Main Django project
│   │   ├── settings.py
│   │   └── urls.py
│   ├── accounts/               # User auth app
│   ├── restaurant/             # Restaurant + Category + Review
│   ├── menu/                   # MenuItem + MenuCategory
│   ├── cart/                   # Cart + CartItem
│   ├── orders/                 # Order + OrderItem
│   ├── seed.py                 # Database seed script
│   └── ecosystem.config.cjs   # PM2 config
│
└── foodrush-frontend/          # React frontend
    └── src/
        ├── api/index.js        # Axios API service
        ├── context/
        │   ├── AuthContext.js
        │   └── CartContext.js
        ├── components/
        │   ├── Navbar.js
        │   ├── CartSidebar.js
        │   └── Footer.js
        └── pages/
            ├── Home.js
            ├── Restaurants.js
            ├── RestaurantDetail.js
            ├── Login.js / Register.js
            ├── Checkout.js
            ├── Orders.js / OrderDetail.js
            ├── Profile.js
            └── Dashboard.js
```

---

## 🔗 API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login → returns JWT tokens |
| POST | `/api/auth/refresh/` | Refresh access token |
| GET/PATCH | `/api/auth/profile/` | View/update profile |

### Restaurants
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/restaurants/` | List all (filter: search, city, category, featured, sort) |
| GET | `/api/restaurants/<id>/` | Detail with menu + reviews |
| GET | `/api/restaurants/categories/` | All cuisine categories |
| POST | `/api/restaurants/<id>/reviews/` | Add review |

### Menu
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/menu/` | List (filter: restaurant, veg, search, featured) |
| GET | `/api/menu/<id>/` | Single item detail |

### Cart
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/cart/` | Get current cart |
| POST | `/api/cart/` | Add item |
| PATCH | `/api/cart/<id>/` | Update item quantity |
| DELETE | `/api/cart/<id>/` | Remove item |
| DELETE | `/api/cart/` | Clear cart |

### Orders
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/orders/` | My order history |
| POST | `/api/orders/place/` | Place order from cart |
| GET | `/api/orders/<id>/` | Order detail |
| POST | `/api/orders/<id>/cancel/` | Cancel order |
| PATCH | `/api/orders/<id>/status/` | Update status (owner only) |

---

## 🌱 Seed Data

- **10 cuisine categories** (Pizza, Burger, Sushi, Indian, Chinese, Mexican, Desserts, Healthy, BBQ, Seafood)
- **8 restaurants** across NYC, SF, LA, Chicago
- **69+ menu items** with full details (prices, descriptions, veg/spice flags, prep time)
- **Sample reviews** pre-loaded

---

## 🚀 How to Run Locally

```bash
# Backend
cd /home/user/foodrush
pip3 install django djangorestframework djangorestframework-simplejwt django-cors-headers Pillow
python3 manage.py migrate
python3 seed.py
python3 manage.py runserver 0.0.0.0:8000

# Frontend (new terminal)
cd /home/user/foodrush-frontend
npm install
DANGEROUSLY_DISABLE_HOST_CHECK=true PORT=3000 npm start
```

---

## 🔮 Recommended Next Steps

1. **Real-time order tracking** – WebSocket with Django Channels
2. **Image uploads** – Add restaurant/menu item image upload UI
3. **Search autocomplete** – Elasticsearch integration
4. **Push notifications** – Firebase Cloud Messaging
5. **Payment gateway** – Stripe integration
6. **PostgreSQL** – Replace SQLite for production
7. **Docker** – Containerize backend + frontend
8. **Admin panel customization** – Django admin with branding
