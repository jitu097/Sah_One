# Sah One - Food Delivery Application (Frontend)

A modern, full-featured food delivery application built with React, Redux Toolkit, and Material-UI.

## Features

### User Features
- 🍔 Browse menu items with search and category filters
- 🛒 Shopping cart with quantity management
- 📦 Order placement and tracking
- 👤 User profile management
- 💳 Multiple payment options (COD & Online)
- 🔔 Real-time order status updates

### Admin Features
- 📊 Comprehensive dashboard with analytics
- 📋 Order management with status updates
- 🍕 Menu item CRUD operations
- 🎁 Offer and coupon management
- 📈 Reports and analytics
- 👥 Customer insights

### Delivery Partner Features
- 🚚 View assigned deliveries
- 📍 Order pickup confirmation with OTP
- ✅ Delivery confirmation with OTP
- 📱 Real-time order status updates

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **State Management:** Redux Toolkit
- **UI Library:** Material-UI (MUI)
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Charts:** Chart.js & react-chartjs-2
- **Notifications:** React Hot Toast
- **PWA:** Service Worker for offline support

## Project Structure

```
client/
├── public/
│   ├── index.html
│   ├── manifest.json          # PWA configuration
│   ├── service-worker.js      # Offline & cache support
│   └── icons/                 # App icons for PWA
│
├── src/
│   ├── app/
│   │   ├── App.jsx            # Main app component
│   │   ├── routes.jsx         # Role-based routing
│   │   └── store.js           # Redux store configuration
│   │
│   ├── auth/
│   │   ├── Login.jsx          # Login/Register page
│   │   ├── ProtectedRoute.jsx # Route protection
│   │   ├── authSlice.js       # Auth state management
│   │   └── roleGuard.js       # Role-based access control
│   │
│   ├── user/
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Menu browsing
│   │   │   ├── Cart.jsx       # Shopping cart
│   │   │   ├── Checkout.jsx   # Order checkout
│   │   │   ├── Orders.jsx     # Order history
│   │   │   └── Profile.jsx    # User profile
│   │   ├── cartSlice.js       # Cart state management
│   │   └── components/
│   │
│   ├── admin/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx  # Analytics dashboard
│   │   │   ├── Orders.jsx     # Order management
│   │   │   ├── Menu.jsx       # Menu management
│   │   │   ├── Offers.jsx     # Offers management
│   │   │   └── Reports.jsx    # Reports & analytics
│   │   └── components/
│   │
│   ├── delivery/
│   │   ├── pages/
│   │   │   ├── AssignedOrders.jsx
│   │   │   ├── Pickup.jsx
│   │   │   └── DeliveryConfirm.jsx
│   │   └── components/
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── BottomNav.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Loader.jsx
│   │   ├── services/
│   │   │   ├── api.js         # Axios instance
│   │   │   └── authService.js # Auth API calls
│   │   ├── slices/
│   │   │   ├── orderSlice.js
│   │   │   └── menuSlice.js
│   │   ├── hooks/
│   │   │   └── useDebounce.js
│   │   └── utils/
│   │       └── helpers.js     # Utility functions
│   │
│   ├── styles/
│   │   ├── theme.js           # MUI theme configuration
│   │   └── global.css         # Global styles
│   │
│   └── main.jsx               # App entry point
│
├── .env                       # Environment variables
├── package.json
└── vite.config.js
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Edit `.env` file and update:
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Sah One
VITE_RAZORPAY_KEY=your_razorpay_key_here
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
```bash
npm run preview
```

## PWA Features

The app includes Progressive Web App capabilities:
- ✅ Installable on mobile and desktop
- ✅ Offline support with service worker
- ✅ Cache-first strategy for static assets
- ✅ App icons for all platforms
- ✅ Splash screen support

## Role-Based Access

The application supports three user roles:

1. **User (Customer)**
   - Browse menu and place orders
   - Track order status
   - Manage profile and addresses

2. **Admin**
   - Manage menu items
   - Process and update orders
   - Create offers and promotions
   - View analytics and reports

3. **Delivery Partner**
   - View assigned deliveries
   - Confirm pickup and delivery with OTP
   - Update delivery status

## API Integration

The app connects to a backend API with the following endpoints:

- `/api/auth/*` - Authentication
- `/api/menu/*` - Menu management
- `/api/orders/*` - Order management
- `/api/offers/*` - Offers management
- `/api/admin/*` - Admin operations
- `/api/delivery/*` - Delivery operations

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and proprietary.

## Contributors

Sah One Development Team
