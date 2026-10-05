# ⚡ AeroStore — Full-Stack E-Commerce Platform

A production-ready, full-stack e-commerce web application engineered with modern aesthetics, robust role-based access control (RBAC), end-to-end shopping cart and checkout flows, order lifecycle tracking, and an admin management & analytics dashboard.

---

## 🌟 Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 19 + Vite | Ultra-fast client, reactive state management, modular components |
| **Styling** | Vanilla CSS Design System | Curated dark mode, glassmorphism, responsive grid, micro-animations |
| **Icons & FX** | Lucide React + Canvas Confetti | Clean iconography and celebratory checkout effects |
| **Backend** | Node.js & Express (ESM) | RESTful API architecture with modular routers, controllers & middleware |
| **Database** | MongoDB & Mongoose | Relational document schemas, indexing, validation, and aggregations |
| **Authentication** | JWT & Bcrypt.js | Stateless tokens, password hashing, and role-based route guards |

---

## 🚀 Key Features

### 1. 🛍️ Product Catalog & Discovery
- **Live Search & Category Filtering:** Instant search across title, description, and brand, plus category pills (Audio, Wearables, Gaming, Electronics, Accessories, Home Office).
- **Sorting & Availability:** Sort by Newest, Price (Low/High), Rating, and Name. Filter by "In Stock Only".
- **Product Detail Modal & Pages:** Interactive modal with thumbnail gallery, technical specifications table, real-time stock indicators, and customer reviews count.
- **Stock Management:** Visual badges for discounts (`-15% OFF`), low stock alerts (`Only 4 left!`), and sold out status.

### 2. 🛒 Shopping Cart & Persistence
- **Dual Persistence:** Automatically synchronizes with the MongoDB database for logged-in users, while providing `localStorage` persistence for guest shoppers.
- **Interactive Cart Drawer & Dedicated Cart Page:** Slide-out drawer with free shipping progress bar ($100 threshold), item quantity adjusters (`+` / `-`), removal triggers, and total breakdown.
- **Promo Code Support:** Test code `AERO10` applies an instant 10% discount on the cart page.

### 3. 💳 Checkout & Order Processing
- **Multi-Step Checkout:** Shipping address auto-fills from saved profile data.
- **Payment Method Simulation:** Choose between interactive Credit Card (with simulated chip card preview), PayPal, or Cash on Delivery.
- **Atomic Stock Decrement:** Stock is verified and deducted upon order placement.
- **Auto Cart Clearance:** Automatically empties the cart upon verified checkout.
- **Order Confirmation Page:** Celebratory confetti animation, generated tracking number (`TRK-...`), shipping breakdown, and receipt summary.

### 4. 📦 Order Tracking & History
- **Customer Order History:** Chronological log of previous purchases with item thumbnails, payment timestamps, and live fulfillment status badges (`Processing`, `Shipped`, `Delivered`).

### 5. 👑 Admin Portal & Analytics
- **KPI Metrics Dashboard:** Real-time revenue calculations, total orders count, average order value, active products, and customer counts.
- **Category Sales Breakdown:** Interactive percentage bars showing revenue and volume sold per category.
- **Low Stock Inventory Warnings:** Identifies products with $\le 5$ units remaining.
- **Product Management (CRUD):** Create, update, or delete products with prefilled sample data button for instant testing.
- **Order Management:** View all orders storewide with status updater dropdown (`Processing` $\rightarrow$ `Shipped` $\rightarrow$ `Delivered` $\rightarrow$ `Cancelled`).

---

## 👥 Demo User Credentials

The Login page includes **1-Click Quick Fill Buttons** for instant reviewer testing:

| Role | Email | Password | Privileges |
|---|---|---|---|
| **👑 Admin** | `admin@store.com` | `Admin@123` | Full access: Admin Portal, Analytics, Product CRUD, Order Status Management |
| **👤 Customer** | `alex@store.com` | `User@123` | Storefront browsing, Cart, Checkout, Order History, Profile |

---

## 🛠️ Getting Started (Local Setup)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally on port 27017, or a MongoDB Atlas URI)

### 1. Install Dependencies
Run the install command from the root directory:
```bash
npm run install:all
```
*(Alternatively, run `npm install` inside both `server/` and `client/` directories).*

### 2. Environment Configuration
The server includes a pre-configured `.env` file in `server/.env`:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/ecommerce_db
JWT_SECRET=super_secret_jwt_key_ecomm_prod_2026_xyz!@#
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Seed Sample Data
Populate the database with demo products, users, cart, and sample orders:
```bash
npm run seed
```

### 4. Start the Application
Run both the Express backend and Vite frontend concurrently with one command:
```bash
npm run dev
```

- **Frontend Client:** [http://localhost:5173](http://localhost:5173) (or `5174` if 5173 is in use)
- **Backend API:** [http://localhost:5001](http://localhost:5001)
- **API Health Check:** [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## 🗄️ Database Schemas & Architecture

```
User (Role: 'user' | 'admin')
  ├── addresses: [{ street, city, state, postalCode, country }]
  └── password (Bcrypt hashed)

Product
  ├── name, description, price, compareAtPrice
  ├── category ('Audio' | 'Wearables' | 'Electronics' | 'Gaming' | 'Accessories' | 'Home Office')
  ├── stock, images, rating, specs (Map of key-values), featured

Cart
  ├── user -> ref: User
  └── items: [{ product -> ref: Product, quantity, price }]

Order
  ├── user -> ref: User
  ├── orderItems: [{ product -> ref: Product, name, image, price, quantity }]
  ├── shippingAddress: { fullName, street, city, state, postalCode, country, phone }
  ├── paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice, isPaid
  └── orderStatus ('Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled')
```

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new customer
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/profile` — Get authenticated user details [Private]
- `PUT /api/auth/profile` — Update name, password, or address [Private]

### Products (`/api/products`)
- `GET /api/products` — Query products (supports `keyword`, `category`, `sort`, `inStock`, `limit`, `page`)
- `GET /api/products/:id` — Fetch single product details
- `GET /api/products/meta/categories` — Get distinct categories and counts
- `POST /api/products` — Create a new product [Admin]
- `PUT /api/products/:id` — Update product details [Admin]
- `DELETE /api/products/:id` — Remove product [Admin]

### Cart (`/api/cart`)
- `GET /api/cart` — Fetch user's cart [Private]
- `POST /api/cart` — Add item to cart with stock validation [Private]
- `PUT /api/cart/:productId` — Update item quantity in cart [Private]
- `DELETE /api/cart/:productId` — Remove item from cart [Private]
- `DELETE /api/cart` — Clear entire cart [Private]

### Orders (`/api/orders`)
- `POST /api/orders` — Create new order and deduct stock [Private]
- `GET /api/orders/myorders` — Retrieve logged-in user's order history [Private]
- `GET /api/orders/:id` — Get order receipt and tracking info [Private]
- `GET /api/orders` — Get all store orders with pagination and status filters [Admin]
- `PUT /api/orders/:id/status` — Update order fulfillment status [Admin]

### Admin Analytics (`/api/admin`)
- `GET /api/admin/analytics` — Financial KPIs, category breakdown, low-stock alerts, and recent orders [Admin]

---

## 📂 Project Directory Structure

```
E COMM/
├── package.json               # Root scripts (install:all, dev, seed)
├── README.md                  # Comprehensive setup and API documentation
├── server/                    # Node.js + Express Backend
│   ├── config/
│   │   └── db.js              # Mongoose database connection
│   ├── controllers/
│   │   ├── authController.js  # Registration, login, profile logic
│   │   ├── productController.js # Filtering, sorting, CRUD
│   │   ├── cartController.js  # Cart synchronization
│   │   ├── orderController.js # Checkout, stock decrement, history
│   │   └── adminController.js # Analytics & revenue aggregations
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification & Admin RBAC
│   │   └── errorMiddleware.js # Global error handler & 404 catcher
│   ├── models/
│   │   ├── User.js            # User schema with bcrypt hooks
│   │   ├── Product.js         # Product schema with text indexes
│   │   ├── Cart.js            # Cart schema with product references
│   │   └── Order.js           # Order schema with items & tracking
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── adminRoutes.js
│   ├── seed/
│   │   └── seedData.js        # Realistic catalog & user demo seeder
│   ├── .env                   # Server environment configuration
│   ├── package.json
│   └── server.js              # Express server entrypoint
└── client/                    # React 19 + Vite Frontend
    ├── src/
    │   ├── api/
    │   │   └── apiClient.js   # Centralized fetch wrapper with JWT
    │   ├── components/
    │   │   ├── Navbar.jsx     # Sticky glass navbar with search & cart badge
    │   │   ├── Footer.jsx     # Store footer with guarantees
    │   │   ├── ProductCard.jsx# Interactive product card with badges
    │   │   ├── ProductDetailModal.jsx # Specs, gallery, quick add
    │   │   ├── CartDrawer.jsx # Slide-out cart with shipping meter
    │   │   └── ProtectedRoute.jsx # Role-based router guards
    │   ├── context/
    │   │   ├── AuthContext.jsx # User session & login state
    │   │   ├── CartContext.jsx # Cart actions & calculations
    │   │   └── ToastContext.jsx# Floating notification toasts
    │   ├── pages/
    │   │   ├── HomePage.jsx   # Hero, live search, catalog grid
    │   │   ├── CartPage.jsx   # Full cart breakdown & promo codes
    │   │   ├── CheckoutPage.jsx # Shipping form & payment simulation
    │   │   ├── OrderConfirmationPage.jsx # Confetti & order tracking
    │   │   ├── OrderHistoryPage.jsx # Customer purchase timeline
    │   │   ├── LoginPage.jsx  # Auth with 1-click reviewer quick-fill
    │   │   ├── RegisterPage.jsx # Customer account signup
    │   │   └── AdminDashboardPage.jsx # Analytics, Product CRUD, Orders
    │   ├── styles/
    │   │   └── index.css      # Custom design tokens, glassmorphism
    │   ├── App.jsx            # Router and layout configuration
    │   └── main.jsx           # React DOM root
    ├── vite.config.js         # Proxy configuration for /api
    └── package.json
```
