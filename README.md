<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Poppins&weight=800&size=42&pause=1000&color=FF6B35&center=true&vCenter=true&width=600&lines=🍔+FoodRush;Food+Delivery+Reimagined;Order.+Track.+Enjoy." alt="FoodRush" />

<br/>

<img src="https://img.shields.io/badge/Django-6.0-092E20?style=for-the-badge&logo=django&logoColor=white"/>
<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
<img src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
<img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>
<img src="https://img.shields.io/badge/REST-API-FF6B35?style=for-the-badge&logo=fastapi&logoColor=white"/>
<img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white"/>

<br/><br/>

> **FoodRush** is a full-stack food delivery web application built with **Django REST Framework** + **React.js** — featuring JWT authentication, real-time order tracking, restaurant management, cart system, and a stunning UI. Evolved from a basic Django learning project into a production-ready platform.

<br/>

<a href="#-demo">View Demo</a> · <a href="#-features">Features</a> · <a href="#-quick-start">Quick Start</a> · <a href="#-api-docs">API Docs</a> · <a href="#-screenshots">Screenshots</a>

---

</div>

## 📸 App Preview

<div align="center">

| 🏠 Home Page | 🍽️ Restaurant Detail |
|:---:|:---:|
| Hero banner with search, featured restaurants, cuisine filters | Full menu with categories, add to cart, reviews |

| 🛒 Cart Sidebar | 📦 Order Tracking |
|:---:|:---:|
| Slide-in cart with quantity controls & live totals | Step-by-step visual timeline with live refresh |

| 🍳 Owner Dashboard | 👤 Profile |
|:---:|:---:|
| Stats, live order management, status updates | Editable profile with role badge |

</div>

---

## ✨ Features

<details open>
<summary><b>🔐 Authentication System</b></summary>

- ✅ JWT-based login & registration (`djangorestframework-simplejwt`)
- ✅ Auto token refresh interceptor (Axios)
- ✅ Role-based access: **Customer** / **Restaurant Owner** / **Delivery Agent**
- ✅ Protected React routes with redirect
- ✅ Persistent sessions via `localStorage`

</details>

<details open>
<summary><b>🏪 Restaurant Discovery</b></summary>

- ✅ Browse 500+ restaurants with **instant search**
- ✅ Filter by **10 cuisine categories** (Pizza 🍕, Burger 🍔, Sushi 🍣, Indian 🍛, Chinese 🥡, Mexican 🌮, Desserts 🍰, Healthy 🥗, BBQ 🍖, Seafood 🦞)
- ✅ Sort by **Rating / Fastest Delivery / Lowest Fee**
- ✅ **Open Now** real-time filter
- ✅ Featured restaurants spotlight
- ✅ Delivery time, fee & minimum order display

</details>

<details open>
<summary><b>🍽️ Smart Menu System</b></summary>

- ✅ Menu items grouped by **category tabs**
- ✅ **Vegetarian badge** 🥦 with green indicator
- ✅ **Spice level** indicator 🌶️ (None → Extra Hot)
- ✅ Calorie count & prep time display
- ✅ Popular/Featured item highlights ⭐
- ✅ Inline quantity control — no page reload

</details>

<details open>
<summary><b>🛒 Cart Experience</b></summary>

- ✅ Slide-in **cart sidebar** accessible from any page
- ✅ Auto-clears on switching restaurants (with warning)
- ✅ Quantity increment / decrement / remove
- ✅ Per-item **special instructions**
- ✅ Live subtotal + delivery fee + grand total
- ✅ Cart item count badge on navbar

</details>

<details open>
<summary><b>📦 Order Lifecycle</b></summary>

- ✅ Checkout with **delivery address**, phone, payment method
- ✅ Payment options: Cash on Delivery 💵, Card 💳, Digital Wallet 📱
- ✅ Price **snapshot** on order creation (immune to menu price changes)
- ✅ **7-step visual order tracking timeline**
- ✅ Auto-refresh every **30 seconds** for live updates
- ✅ Cancel order (only Pending/Confirmed stage)
- ✅ Full order history page

</details>

<details open>
<summary><b>⭐ Reviews & Ratings</b></summary>

- ✅ Interactive **star rating** with hover effect
- ✅ Comment submission
- ✅ Auto-recalculates restaurant **avg rating** after each review
- ✅ Review count tracking

</details>

<details open>
<summary><b>🍳 Restaurant Owner Dashboard</b></summary>

- ✅ **4 live stat cards** — Revenue, Total Orders, Pending Orders, Avg Rating
- ✅ One-click **order status advancement**
- ✅ Filter orders by status (Pending, Confirmed, Preparing, Ready, On The Way, Delivered, Cancelled)
- ✅ My Restaurants listing with open/close status
- ✅ Per-order: items breakdown, customer address, total

</details>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React.js 18 | SPA UI framework |
| **Routing** | React Router v6 | Client-side navigation |
| **HTTP Client** | Axios | API calls + JWT interceptors |
| **State** | React Context API | Auth + Cart global state |
| **Notifications** | react-hot-toast | Toast notifications |
| **Icons** | react-icons (Feather) | UI icons |
| **Styling** | Pure CSS (Custom Design System) | No heavy CSS framework |
| **Backend** | Django 6 | Web framework |
| **REST API** | Django REST Framework 3.16 | API layer |
| **Auth** | djangorestframework-simplejwt | JWT tokens |
| **CORS** | django-cors-headers | Cross-origin requests |
| **Database** | SQLite | Development database |
| **Process Mgr** | PM2 | Production process management |

</div>

---

## 📁 Project Structure

```
FoodRush/
│
├── 🐍 foodrush/                        # Django Backend
│   ├── core/                           # Main project config
│   │   ├── settings.py                 # JWT, CORS, DRF config
│   │   └── urls.py                     # Root URL routing
│   │
│   ├── accounts/                       # 👤 User Authentication App
│   │   ├── models.py                   # Custom User (email login, roles)
│   │   ├── serializers.py              # Register, Login, Profile serializers
│   │   ├── views.py                    # Register, Login, Profile views
│   │   └── urls.py
│   │
│   ├── restaurant/                     # 🏪 Restaurant App
│   │   ├── models.py                   # Restaurant, Category, Review
│   │   ├── serializers.py
│   │   ├── views.py                    # List, Detail, Create, Reviews
│   │   └── urls.py
│   │
│   ├── menu/                           # 🍽️ Menu App
│   │   ├── models.py                   # MenuItem, MenuCategory
│   │   ├── serializers.py
│   │   ├── views.py                    # List, Detail, CRUD
│   │   └── urls.py
│   │
│   ├── cart/                           # 🛒 Cart App
│   │   ├── models.py                   # Cart, CartItem
│   │   ├── serializers.py
│   │   ├── views.py                    # Add, Update, Remove, Clear
│   │   └── urls.py
│   │
│   ├── orders/                         # 📦 Orders App
│   │   ├── models.py                   # Order (7 statuses), OrderItem
│   │   ├── serializers.py
│   │   ├── views.py                    # Place, List, Detail, Status, Cancel
│   │   └── urls.py
│   │
│   ├── seed.py                         # 🌱 Database seeder
│   ├── manage.py
│   └── ecosystem.config.cjs            # PM2 config
│
└── ⚛️  foodrush-frontend/              # React Frontend
    └── src/
        ├── api/
        │   └── index.js                # Axios instance + all API calls
        │
        ├── context/
        │   ├── AuthContext.js          # Auth state + login/logout/register
        │   └── CartContext.js          # Cart state + add/update/remove
        │
        ├── components/
        │   ├── Navbar.js               # Sticky nav with cart count badge
        │   ├── CartSidebar.js          # Slide-in cart panel
        │   └── Footer.js               # Footer with links
        │
        ├── pages/
        │   ├── Home.js                 # Hero + featured + category browse
        │   ├── Restaurants.js          # Listing with search/filter/sort
        │   ├── RestaurantDetail.js     # Menu tabs + reviews + add to cart
        │   ├── Login.js                # JWT login form
        │   ├── Register.js             # Registration with role selection
        │   ├── Checkout.js             # Delivery + payment + order summary
        │   ├── Orders.js               # Order history list
        │   ├── OrderDetail.js          # Tracking timeline + order items
        │   ├── Profile.js              # Editable user profile
        │   └── Dashboard.js            # Owner: stats + order management
        │
        ├── App.js                      # Routes + providers
        └── index.css                   # Global design system (CSS variables)
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/foodrush.git
cd foodrush
```

### 2️⃣ Backend Setup

```bash
# Install Python dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers Pillow

# Run migrations
python manage.py migrate

# Seed the database (restaurants, menu items, users)
python seed.py

# Start the Django server
python manage.py runserver 0.0.0.0:8000
```

✅ API running at **http://localhost:8000**

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend
cd ../foodrush-frontend

# Install dependencies
npm install

# Start React dev server
PORT=3000 DANGEROUSLY_DISABLE_HOST_CHECK=true npm start
```

✅ App running at **http://localhost:3000**

### 4️⃣ Login & Explore

| Role | Email | Password |
|------|-------|----------|
| 🛒 **Customer** | `john@example.com` | `test123` |
| 🍳 **Restaurant Owner** | `admin@foodrush.com` | `admin123` |

---

## 🌱 Seed Data Overview

The `seed.py` script populates the database with realistic data:

```
📊 Database Contents After Seeding:
  ✅ 10 cuisine categories     (Pizza, Burger, Sushi, Indian, Chinese, Mexican...)
  ✅ 4  user accounts          (admin, 2 owners, 1 customer)
  ✅ 8  restaurants            (NYC, San Francisco, LA, Chicago)
  ✅ 69 menu items             (with prices, descriptions, veg/spice flags)
  ✅ 5  sample reviews         (with star ratings and comments)
```

**Sample Restaurants:**
| Restaurant | Cuisine | City | Rating |
|-----------|---------|------|--------|
| Tony's Pizzeria | 🍕 Pizza | New York | ⭐ 4.8 |
| Burger Palace | 🍔 Burger | New York | ⭐ 4.6 |
| Sakura Sushi Bar | 🍣 Sushi | San Francisco | ⭐ 4.9 |
| Spice Garden | 🍛 Indian | New York | ⭐ 4.7 |
| Dragon Palace | 🥡 Chinese | New York | ⭐ 4.5 |
| El Rancho Taqueria | 🌮 Mexican | Los Angeles | ⭐ 4.4 |
| Sweet Bliss Bakery | 🍰 Desserts | Chicago | ⭐ 4.9 |
| Green Bowl | 🥗 Healthy | San Francisco | ⭐ 4.6 |

---

## 📡 API Documentation

### 🔐 Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register/` | ❌ | Register new user |
| `POST` | `/api/auth/login/` | ❌ | Login → JWT tokens |
| `POST` | `/api/auth/refresh/` | ❌ | Refresh access token |
| `GET` | `/api/auth/profile/` | ✅ | Get current user |
| `PATCH` | `/api/auth/profile/` | ✅ | Update profile |

**Login Request:**
```json
POST /api/auth/login/
{
  "email": "john@example.com",
  "password": "test123"
}
```
**Login Response:**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 4,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

### 🏪 Restaurant Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/restaurants/` | ❌ | List all restaurants |
| `GET` | `/api/restaurants/?search=pizza` | ❌ | Search |
| `GET` | `/api/restaurants/?category=Indian` | ❌ | Filter by cuisine |
| `GET` | `/api/restaurants/?sort=rating` | ❌ | Sort (rating/delivery/fee) |
| `GET` | `/api/restaurants/?featured=true` | ❌ | Featured only |
| `GET` | `/api/restaurants/<id>/` | ❌ | Restaurant detail + menu + reviews |
| `POST` | `/api/restaurants/create/` | ✅ Owner | Create restaurant |
| `GET` | `/api/restaurants/my/` | ✅ Owner | My restaurants |
| `POST` | `/api/restaurants/<id>/reviews/` | ✅ | Add review |
| `GET` | `/api/restaurants/categories/` | ❌ | All cuisine categories |

---

### 🍽️ Menu Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/menu/?restaurant=1` | ❌ | Menu for a restaurant |
| `GET` | `/api/menu/?veg=true` | ❌ | Vegetarian items only |
| `GET` | `/api/menu/?featured=true` | ❌ | Popular items |
| `GET` | `/api/menu/<id>/` | ❌ | Single item detail |
| `POST` | `/api/menu/create/` | ✅ Owner | Add menu item |
| `PATCH` | `/api/menu/<id>/edit/` | ✅ Owner | Update item |
| `DELETE` | `/api/menu/<id>/edit/` | ✅ Owner | Delete item |

---

### 🛒 Cart Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/cart/` | ✅ | Get current cart |
| `POST` | `/api/cart/` | ✅ | Add item to cart |
| `PATCH` | `/api/cart/<item_id>/` | ✅ | Update item quantity |
| `DELETE` | `/api/cart/<item_id>/` | ✅ | Remove single item |
| `DELETE` | `/api/cart/` | ✅ | Clear entire cart |

**Add to Cart:**
```json
POST /api/cart/
{
  "menu_item_id": 5,
  "quantity": 2,
  "special_instructions": "No onions please"
}
```

---

### 📦 Order Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/orders/` | ✅ | My order history |
| `POST` | `/api/orders/place/` | ✅ | Place order from cart |
| `GET` | `/api/orders/<id>/` | ✅ | Order detail |
| `POST` | `/api/orders/<id>/cancel/` | ✅ | Cancel order |
| `PATCH` | `/api/orders/<id>/status/` | ✅ Owner | Update order status |
| `GET` | `/api/orders/restaurant/` | ✅ Owner | All restaurant orders |

**Place Order:**
```json
POST /api/orders/place/
Authorization: Bearer <token>
{
  "delivery_address": "42 Maple Street, Apt 3B",
  "delivery_city": "New York",
  "delivery_phone": "+1-555-1234",
  "payment_method": "cod",
  "special_instructions": "Ring the doorbell"
}
```

**Order Status Flow:**
```
pending → confirmed → preparing → ready → on_the_way → delivered
                                                    ↘
                                                  cancelled (from pending/confirmed only)
```

---

## 🗄️ Database Models

```python
# accounts/models.py
class User(AbstractUser):
    email      # Used as USERNAME_FIELD
    phone
    role       # customer | restaurant_owner | delivery_agent
    avatar
    address, city

# restaurant/models.py
class Category:
    name, icon

class Restaurant:
    owner (FK→User), name, description, category (FK)
    address, city, phone, email
    rating, total_reviews, delivery_time, delivery_fee, min_order
    is_open, is_featured

class Review:
    restaurant (FK), user (FK), rating (1-5), comment

# menu/models.py
class MenuCategory:
    restaurant (FK), name, order

class MenuItem:
    restaurant (FK), category (FK)
    name, description, price, image
    is_available, is_veg, is_featured
    spice_level (0-4), prep_time, calories

# cart/models.py
class Cart:
    user (OneToOne), restaurant (FK)
    → total (property), item_count (property)

class CartItem:
    cart (FK), menu_item (FK)
    quantity, special_instructions
    → subtotal (property)

# orders/models.py
class Order:
    user (FK), restaurant (FK)
    status  # 7 choices
    payment_method, payment_status
    delivery_address, delivery_city, delivery_phone
    subtotal, delivery_fee, total, estimated_delivery

class OrderItem:  # Price snapshot
    order (FK), menu_item (FK)
    name, price, quantity, subtotal  # Snapshotted at order time
```

---

## ⚙️ Configuration

### Django Settings (core/settings.py)

```python
# JWT Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME':  timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS':  True,
    'AUTH_HEADER_TYPES':      ('Bearer',),
}

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
}

# CORS — allow all origins for development
CORS_ALLOW_ALL_ORIGINS = True
```

### Environment Variables (create `.env` for production)

```env
SECRET_KEY=your-super-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:pass@localhost/foodrush
CORS_ALLOWED_ORIGINS=https://yourfrontend.com
```

---

## 🔮 Roadmap

| Feature | Status |
|---------|--------|
| JWT Authentication | ✅ Done |
| Restaurant CRUD | ✅ Done |
| Menu Management | ✅ Done |
| Cart System | ✅ Done |
| Order Placement | ✅ Done |
| Order Tracking Timeline | ✅ Done |
| Reviews & Ratings | ✅ Done |
| Owner Dashboard | ✅ Done |
| Real-time WebSocket tracking | 🔜 Planned |
| Image Uploads (Cloudinary) | 🔜 Planned |
| Stripe Payment Integration | 🔜 Planned |
| Push Notifications (FCM) | 🔜 Planned |
| PostgreSQL + Docker | 🔜 Planned |
| Elasticsearch for search | 🔜 Planned |
| Mobile App (React Native) | 🔜 Planned |
| Email notifications | 🔜 Planned |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ using Django + React**

⭐ **Star this repo if you found it helpful!** ⭐

<img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=18&pause=1000&color=FF6B35&center=true&vCenter=true&width=500&lines=Built+with+Python+%2B+Django+%2B+React.js;Full+JWT+Authentication;REST+API+%2B+SQLite+Database;Production-Ready+Architecture" alt="Footer typing" />

</div>
