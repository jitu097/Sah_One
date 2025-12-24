# 📘 Sah One - Complete Client Application Guide

> **A comprehensive guide to understand the flow, structure, and working of every file and folder**

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Complete Folder Structure Explained](#complete-folder-structure-explained)
3. [File Types and Their Purposes](#file-types-and-their-purposes)
4. [Application Flow](#application-flow)
5. [Component Import System](#component-import-system)
6. [Routing Flow](#routing-flow)
7. [State Management Flow](#state-management-flow)
8. [Role-Based Access Flow](#role-based-access-flow)
9. [Data Flow Between Files](#data-flow-between-files)
10. [Adding New Features - Step Flow](#adding-new-features---step-flow)

---

## 🎯 Project Overview

**Sah One** is a food delivery application built with React, featuring three distinct user roles:
- **Admin** - Manages orders, menu, offers, and reports
- **Delivery** - Handles order delivery and tracking
- **User** - Browses menu, places orders, manages cart

### Tech Stack
- **Frontend Framework**: React 18+ (Component-based architecture)
- **UI Library**: Material-UI (Pre-built components)
- **State Management**: Redux Toolkit (Global state)
- **Routing**: React Router v6 (Page navigation)
- **Styling**: CSS files + MUI styling
- **Build Tool**: Vite (Fast development server)
- **Backend**: Convex (Serverless database)

---

## 📂 Complete Folder Structure Explained

### Root Level Structure

```
client/src/
├── admin/          # Everything related to admin functionality
├── delivery/       # Everything related to delivery functionality  
├── user/           # Everything related to user/customer functionality
├── auth/           # Authentication and authorization logic
├── shared/         # Components used across all roles
├── app/            # Application configuration and setup
├── styles/         # Legacy global styles
└── main.jsx        # Application entry point
```

### Admin Folder (`admin/`)

**Purpose**: Contains all admin-related functionality - dashboard, order management, menu control, reports

**What's Inside**:
- **components/** - Navigation components (Navbar, Sidebar, BottomNav) used only by admin
- **pages/** - Full page views (Dashboard, Orders, Menu, Offers, Reports)
- **hooks/** - Custom React hooks for admin-specific logic (future use)
- **services/** - API calls for admin operations (future use)
- **slices/** - Redux state management for admin data (future use)
- **utils/** - Helper functions (formatCurrency, formatDate, getOrderStatusColor) + mock data
- **styles/** - CSS files specific to admin UI (purple theme, gradients)

**Key Files**:
- `components/Navbar.jsx` - Top navigation bar with admin title and notifications
- `components/Sidebar.jsx` - Left menu with dashboard, orders, menu, offers, reports links
- `components/BottomNav.jsx` - Mobile bottom navigation for admin
- `components/index.js` - Exports all admin components for easy imports
- `pages/Dashboard.jsx` - Statistics, charts, recent orders overview
- `pages/Orders.jsx` - Manage all customer orders
- `pages/Menu.jsx` - Add, edit, delete menu items
- `utils/helpers.js` - Date formatting, currency formatting, status colors
- `utils/mockData.js` - Dummy data (orders, menu items, stats, charts)
- `styles/index.css` - Imports all admin CSS files

**Imports Used**:
- React hooks (useState, useEffect)
- Redux (useSelector for reading state, useDispatch for actions)
- React Router (useNavigate for page navigation)
- Material-UI components (AppBar, Toolbar, Card, Grid, etc.)
- Own utilities (helpers, mockData)
- Own styles (CSS files)

---

### Delivery Folder (`delivery/`)

**Purpose**: Contains all delivery partner functionality - viewing assigned orders, confirming deliveries

**What's Inside**:
- **components/** - Navigation components for delivery partner UI
- **pages/** - Pages for assigned orders, delivery confirmation, pickup
- **hooks/** - Custom hooks for delivery logic (future use)
- **services/** - API calls for delivery operations (future use)
- **slices/** - Redux state for delivery data (future use)
- **utils/** - Helper functions + delivery-specific mock data
- **styles/** - CSS with green theme for delivery UI

**Key Files**:
- `components/Navbar.jsx` - Green-themed navbar for delivery partner
- `components/Sidebar.jsx` - Menu with assigned orders, confirm, pickup links
- `components/BottomNav.jsx` - Mobile navigation for delivery
- `pages/AssignedOrders.jsx` - View orders assigned to this delivery partner
- `pages/DeliveryConfirm.jsx` - Confirm successful delivery
- `pages/Pickup.jsx` - Mark order as picked up from restaurant
- `utils/mockData.js` - Mock delivery orders with customer info and addresses
- `styles/index.css` - Green gradient theme styles

**Imports Used**:
- React hooks (useState, useEffect)
- Redux (useSelector, useDispatch)
- React Router (useNavigate, Link)
- Material-UI components
- Own utilities and styles

---

### User Folder (`user/`)

**Purpose**: Customer-facing functionality - browsing menu, cart, checkout, orders

**What's Inside**:
- **components/** - Navigation with cart badge showing item count
- **pages/** - Home (menu browsing), Cart, Checkout, Orders history, Profile
- **hooks/** - Custom hooks for user interactions (future use)
- **services/** - API calls for ordering, payments (future use)
- **slices/** - Redux state management
  - `cartSlice.js` - Shopping cart state (items, quantities, total)
- **utils/** - Helper functions + user-specific mock menu data
- **styles/** - CSS for user pages (home, cart, etc.)

**Key Files**:
- `components/Navbar.jsx` - Navbar with shopping cart icon + badge count
- `pages/Home.jsx` - Browse menu items, search, filter by category
- `pages/Cart.jsx` - View cart items, update quantities, see total
- `pages/Checkout.jsx` - Enter delivery address, payment method
- `pages/Orders.jsx` - View past and current orders
- `pages/Profile.jsx` - User account settings
- `slices/cartSlice.js` - Redux state (addToCart, removeFromCart, updateQuantity, clearCart actions)
- `utils/mockData.js` - Mock menu items with images, prices, categories
- `styles/home.css` - Menu grid, search bar, category filters
- `styles/cart.css` - Cart items layout, summary sidebar

**Imports Used**:
- React hooks (useState, useEffect)
- Redux (useSelector to read cart state, useDispatch to update)
- React Router (useNavigate)
- Material-UI components
- Cart actions from slices
- Mock data from utils
- Multiple CSS files

---

### Auth Folder (`auth/`)

**Purpose**: Handle user authentication, login, signup, and route protection

**What's Inside**:
- **Login.jsx** - Login page with email/password form
- **Signup.jsx** - Registration page for new users
- **ProtectedRoute.jsx** - Component that wraps routes to check authentication
- **roleGuard.js** - Functions to verify user has correct role for a route
- **authSlice.js** - Redux state for authentication (user data, isAuthenticated, role)

**Key Files**:

**authSlice.js**
- **Purpose**: Manages authentication state globally
- **State**: user object, isAuthenticated boolean, user role
- **Actions**: login (set user), logout (clear user), updateProfile
- **Used by**: All components that need user information

**Login.jsx**
- **Purpose**: Display login form and handle login
- **Imports**: React hooks, Redux dispatch, useNavigate
- **Flow**: User enters credentials → dispatch login action → redirect to role dashboard

**Signup.jsx**
- **Purpose**: New user registration
- **Imports**: Similar to Login
- **Flow**: User fills form → create account → auto login → redirect

**ProtectedRoute.jsx**
- **Purpose**: Wrapper component that checks if user is logged in
- **Imports**: useSelector (check auth state), Navigate (redirect)
- **Flow**: Check authentication → Check role → Allow or redirect
- **Used by**: All protected routes in routes.jsx

**roleGuard.js**
- **Purpose**: Helper functions for role validation
- **Exports**: Functions like isAdmin(), isDelivery(), isUser()

---

### Shared Folder (`shared/`)

**Purpose**: Components used across ALL roles - no role-specific logic

**What's Inside**:
- **components/Loader.jsx** - Generic loading spinner shown during data fetch
- **components/ErrorBoundary.jsx** - Catches React errors and shows fallback UI
- **styles/base.css** - Minimal CSS reset, scrollbar styles, utility animations

**Key Files**:

**Loader.jsx**
- **Purpose**: Show loading state
- **Imports**: Material-UI CircularProgress
- **Used in**: Any page while fetching data
- **No role-specific code**

**ErrorBoundary.jsx**
- **Purpose**: Catch errors and prevent app crash
- **Wraps**: App component in main.jsx
- **Shows**: User-friendly error message when something breaks

**base.css**
- **Purpose**: Global CSS reset, scrollbar styling, animations (fadeIn, slideIn, spin)
- **Imported in**: main.jsx (only once)
- **Used by**: Entire application

---

### App Folder (`app/`)

**Purpose**: Core application configuration and setup

**What's Inside**:

**App.jsx**
- **Purpose**: Root component that renders the application
- **Imports**: React Router's Routes, AppRoutes component
- **Structure**: Container → Main content area → AppRoutes renders here
- **Flow**: This is what main.jsx renders

**routes.jsx**
- **Purpose**: Defines ALL application routes
- **Imports**: 
  - React Router (Routes, Route)
  - All page components (Login, Signup, Dashboard, Home, etc.)
  - ProtectedRoute component
- **Structure**: 
  - Public routes (/, /login, /signup)
  - Admin routes (/admin/*)
  - Delivery routes (/delivery/*)
  - User routes (/user/*)
- **Protection**: Each route wrapped in ProtectedRoute with allowed roles

**store.js**
- **Purpose**: Redux store configuration
- **Imports**: 
  - configureStore from Redux Toolkit
  - authSlice reducer (auth state)
  - cartSlice reducer (cart state)
- **Exports**: Configured store
- **Used in**: main.jsx to wrap App with Provider

---

### Main Entry Point

**main.jsx**
- **Purpose**: Application entry point - where everything starts
- **Imports**:
  - React and ReactDOM
  - BrowserRouter (for routing)
  - Redux Provider + store
  - App component
  - base.css (global styles)
- **Flow**: 
  1. Creates Redux Provider with store
  2. Wraps App in BrowserRouter (enables routing)
  3. Renders to root div in index.html
- **This file runs first** when app starts

---

## 📄 File Types and Their Purposes

### JSX Files (.jsx)

**Purpose**: React component files that contain UI and logic

**Three Main Types**:

#### 1. Page Components (in `pages/` folders)

**What they are**: Full-page views that render when you navigate to a route

**Example**: `user/pages/Home.jsx`

**What it does**:
- Displays the main menu browsing page
- Shows search bar and category filters
- Displays grid of menu items

**What it imports**:
- React hooks (useState for search query, selected category)
- Material-UI components (Container, Grid, Card for layout)
- Mock data (MOCK_MENU_ITEMS from utils/mockData.js)
- Styles (home.css for page styling)

**How it works**:
1. Component loads → initializes state (empty search, "All" category)
2. User types in search → updates search state → filters menu items
3. User clicks category → updates category state → filters menu items
4. Filtered items → displayed in grid layout
5. Each item shows image, name, price, "Add to Cart" button

**Similar files**:
- `user/pages/Cart.jsx` - Shows cart items, quantities, total
- `admin/pages/Dashboard.jsx` - Shows statistics, charts, orders
- `delivery/pages/AssignedOrders.jsx` - Shows delivery partner's orders

---

#### 2. Navigation Components (in `components/` folders)

**What they are**: Reusable UI components for navigation

**Example**: `admin/components/Navbar.jsx`

**What it does**:
- Shows top navigation bar with admin branding
- Displays logged-in admin's name
- Shows notification icon
- Allows clicking title to go back to dashboard

**What it imports**:
- Redux useSelector (to get current user from auth state)
- React Router useNavigate (to navigate to pages)
- Material-UI components (AppBar, Toolbar, Typography, IconButton)
- Material-UI icons (Notifications, Menu)

**How it works**:
1. Component renders → reads user from Redux store
2. Displays user's first letter in avatar
3. User clicks menu icon → calls onMenuClick prop (opens sidebar)
4. User clicks title → navigates to /admin
5. User clicks avatar → navigates to profile

**Props it receives**:
- `onMenuClick` - Function to open/close sidebar (from parent page)

**Similar files**:
- `user/components/Navbar.jsx` - Has cart badge showing item count
- `delivery/components/Navbar.jsx` - Green theme for delivery
- `admin/components/Sidebar.jsx` - Left menu with links
- `user/components/BottomNav.jsx` - Mobile bottom navigation

---

#### 3. Shared Generic Components

**Example**: `shared/components/Loader.jsx`

**What it does**:
- Shows spinning circle when data is loading

**What it imports**:
- Material-UI Box and CircularProgress

**How it works**:
- Displays centered spinner in full viewport height
- Used in any page while fetching data from API

**When it's used**:
- User navigates to page → sees Loader
- Data fetches from backend → Loader shown
- Data arrives → Loader replaced with actual content

**Similar files**:
- `shared/components/ErrorBoundary.jsx` - Catches errors, shows friendly message

---

### JavaScript Files (.js)

**Purpose**: Logic, utilities, configuration - no UI

#### Redux Slices (in `slices/` folders)

**Example**: `user/slices/cartSlice.js`

**What it does**:
- Manages shopping cart state globally
- Contains cart data (items array, total price)
- Provides actions to modify cart

**What it exports**:
- Initial state: empty items array, zero total
- Actions: addToCart, removeFromCart, updateQuantity, clearCart
- Reducer function (handles state updates)

**How it works**:
1. User clicks "Add to Cart" → dispatches addToCart action
2. Reducer receives action → checks if item exists in cart
3. If exists → increase quantity, if not → add new item
4. Calculate new total → save to localStorage → update state
5. Components using cart state → automatically re-render with new data

**Used by**:
- store.js (includes it in Redux store)
- Any component using useSelector to read cart
- Any component using useDispatch to update cart

**Similar files**:
- `auth/authSlice.js` - User authentication state (user, isAuthenticated, role)
CSS Import and Usage Flow

### CSS Organization Strategy

Each role has **completely independent styles** stored in their own styles folder.

### How CSS Files are Imported

#### In Main Entry Point (main.jsx)
- Imports `shared/styles/base.css` ONCE
- This provides global reset and utilities for entire app
- Contains scrollbar styling, animations, CSS reset

#### In Page Components
- Each page imports its specific CSS file
- Example: `user/pages/Home.jsx` imports `../styles/home.css`
- Or imports `../styles/index.css` to get all user styles at once

#### In Navigation Components
- Navigation components import navigation.css
- Example: `admin/components/Navbar.jsx` imports `../styles/navigation.css`

### CSS Class Naming Pattern

**Follows this structure**: `.role-component-element`

**Admin classes start with** `admin-`
- `.admin-navbar` - Admin navigation bar
- `.admin-sidebar` - Admin sidebar menu
- `.admin-btn-primary` - Admin primary button
- `.admin-card` - Admin card component
- `.admin-dashboard` - Admin dashboard container

**Delivery classes start with** `delivery-`
- `.delivery-navbar` - Delivery navigation
- `.delivery-order-card` - Delivery order display
- `.delivery-btn-primary` - Delivery buttons
- `.delivery-stat-card` - Delivery statistics

**User classes start with** `user-`
- `.user-navbar` - User navigation
- `.user-home` - User home page
- `.user-cart` - Shopping cart page
- `.menu-item-card` - Menu item display
- `.add-to-cart-btn` - Add to cart button

### Three Ways to Apply Styles

#### Method 1: CSS Classes (Most Common)
- Define styles in .css file
- Apply className in JSX element
- Example: `<div className="user-home">` uses styles from user-home class

#### Method 2: MUI sx Prop (Inline Styling)
- Material-UI components accept sx prop
- Pass object with CSS properties
- Example: Box component with padding, backgroundColor, borderRadius
- Used for one-off styles or dynamic values

#### Method 3: MUI Styled Components
- Create styled version of MUI component
- Define styles once, reuse component
- Example: Create StyledButton with gradient background
- Used when same styled component needed multiple times

### Responsive Design Approach

**Mobile-First Strategy**:
- Default styles target mobile devices (smallest screens)
- Use media queries to add styles for larger screens
- Breakpoints: 768px (tablet), 1024px (desktop)

**How it works**:
1. Base styles apply to all screen sizes (mobile)
2. At 768px width → tablet styles activate
3. At 1024px width → desktop styles activate

**Example flow**:
- Mobile user: Gets 16px padding
- Tablet user: Gets 24px padding (overrides mobile)
- Desktop user: Gets 32px padding (overrides tablet)

### CSS Variable System

**Each role defines color variables**:
- Admin: `--admin-primary`, `--admin-secondary`, `--admin-accent`
- Delivery: `--delivery-primary`, `--delivery-secondary`, `--delivery-accent`
- User: `--user-primary`, `--user-secondary`, `--user-accent`

**Purpose**: Easy theme customization later
**Usage**: Change variable value → updates all uses of that colorxample**: `auth/ProtectedRoute.jsx`

**What it does**:
- Wrapper that checks if user can access a route

**What it imports**:
- useSelector (read auth state)
- Navigate (redirect component)

**How it works**:
1. Wraps route component as children
2. Checks if user is logged in (isAuthenticated)
3. If not → redirect to /login
4. If yes → check if user role matches allowedRoles
5. If role matches → show children (the page)
6. If rApplication Flow

### Complete Application Start Flow

```
- React Router: Routes, Route components
- ProtectedRoute wrapper
- All page components from admin, delivery, user folders
- Login, Signup from auth folder

**Route Types**:

**1. Public Routes** (No authentication needed)
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- Anyone can access these

**2. Admin Routes** (Only admin role)
- `/admin` - Dashboard
- `/admin/orders` - Order management
- `/admin/menu` - Menu management
- `/admin/offers` - Offers management
- `/admin/reports` - Reports and analytics
- Each wrapped in ProtectedRoute with allowedRoles={['admin']}

**3. Delivery Routes** (Only delivery role)
- `/delivery` - Assigned orders
- `/delivery/confirm` - Delivery confirmation
- `/delivery/pickup` - Pickup confirmation
- Each wrapped in ProtectedRoute with allowedRoles={['delivery']}

**4. User Routes** (Only user role)
- `/user` - Home/menu browsing
- `/user/cart` - Shopping cart
- `/user/checkout` - Checkout page
- `/user/orders` - Order history
- `/user/profile` - User profile
- Each wrapped in ProtectedRoute with allowedRoles={['user']}

### How Navigation Works

**Method 1: Programmatic Navigation (useNavigate)**
- Import useNavigate hook from React Router
- Call navigate('/path') to change page
- Used in: Button clicks, form submissions, after actions
- Example: After login → navigate to dashboard

**Method 2: Declarative Navigation (Link)**
- Import Link component from React Router
- Use like anchor tag with 'to' prop instead of 'href'
- Used in: Sidebar menu items, navigation links
- Example: Menu link to orders page

**Navigation triggers**:
1. User clicks link → URL changes
2. React Router detects URL change
3. Matches new URL to route definition
4. Unmounts current component
5. Mounts new component
6. Browser history updated (back button works)

### Protected Route Flow

**File**: `auth/ProtectedRoute.jsx`

**What it does**: Guards routes that require authentication

**What it imports**:
- useSelector (to read auth state from Redux)
- Navigate (to redirect users)

**How it works**:

**Step 1: Check Authentication**
- Reads isAuthenticated from Redux auth state
- If false → User not logged in
- Action: Redirect to /login page

**Step 2: Check Role Authorization**
- Reads user.role from Redux
- Compares with allowedRoles prop
- If role not in allowed list → Wrong role
- Action: Redirect to user's own dashboard (/${user.role})

**Step 3: Grant Access**
- If authenticated AND role matches
- Action: Render children (the protected page)

**Example scenarios**:

**Scenario 1**: Guest user tries to access /user/cart
- Not authenticated → Redirect to /login

**Scenario 2**: Delivery user tries to access /admin
- Authenticated but wrong role → Redirect to /delivery

**Scenario 3**: Admin user accesses /admin/orders
- Authenticated and correct role → Show page ✓
```
1. User on Home page browsing menu
   └─ Sees menu item cards with "Add to Cart" button

2. Home.jsx component:
   ├─ Imports useDispatch hook
   ├─ Imports addToCart action from cartSlice
   └─ Maps over MOCK_MENU_ITEMS to show items

3. User clicks "Add to Cart" on Pizza item
   └─ onClick handler fires

4. Handler function:
   ├─ Gets item data (id, name, price, image)
   └─ dispatch(addToCart(item))

5. Redux receives action
   └─ Goes to cartSlice.js reducer

6. cartSlice reducer:
   ├─ Receives item data in action.payload
   ├─ Checks if item already in cart
   ├─ If exists → Increase quantity
   ├─ If new → Add to items array with quantity: 1
   ├─ Recalculates total price
   ├─ Saves to localStorage
   └─ Updates Redux state

7. State update triggers re-renders:
   ├─ Navbar.jsx (uses useSelector for cart)
   │   └─ Cart badge updates: 0 → 1
   ├─ Cart.jsx (if open, uses useSelector)
   │   └─ Shows new item
   └─ Any component reading cart state

8. User sees immediate feedback:
   ├─ Cart icon badge shows "1"
   └─ Toast notification: "Item added to cart"

9. Data persists:
   └─ Even if user refreshes page, cart data restored from localStorage
```

### Component Import Chain Flow

**Example: How admin/pages/Dashboard.jsx gets everything it needs**

```
1. Dashboard.jsx file starts

2. Imports React functionality:
   ├─ import { useState } from 'react'
   └─ Gives ability to track local state

3. Imports Material-UI components:
   ├─ import { Container, Grid, Card } from '@mui/material'
   ├─ import { ShoppingBag, AttachMoney } from '@mui/icons-material'
   └─ Gets pre-built UI components and icons

4. Imports Chart.js for graphs:
   ├─ import { Line, Doughnut } from 'react-chartjs-2'
   └─ Gets chart rendering components

5. Imports own utilities:
   ├─ import { MOCK_STATS, MOCK_ORDERS } from '../utils/mockData'
   │   └─ Gets fake data for testing
   ├─ import { formatCurrency } from '../utils/helpers'
   │   └─ Gets helper function for formatting
   └─ import '../styles/dashboard.css'
       └─ Gets styling

6. Component function defined:
   └─ Uses all imported items to build UI

7. Export at bottom:
   └─ export default Dashboard
   └─ Makes component available to routes.jsx

8. routes.jsx imports it:
   └─ import Dashboard from '../admin/pages/Dashboard'
   └─ Uses in /admin route
```

---

## 🔄 Routing Flow

### Route Definition Structure (`app/routes.jsx`)

**What this file does**:
- Central location for ALL application routes
- Maps URL paths to components
- Defines which routes need authentication
- Specifies which roles can access which routes

**What it imports**:

### CSS Files (.css)

**Purpose**: Styling for components and pages

#### Role-Specific Styles

**Example**: `admin/styles/navigation.css`

**What it contains**:
- Styles for admin navbar (purple gradient background)
- Styles for admin sidebar (menu items, hover effects)
- Styles for admin bottom nav (mobile navigation)

**Classes defined**:
- `.admin-navbar` - Main navbar container
- `.admin-sidebar` - Sidebar container
- `.sidebar-item` - Individual menu items
- `.sidebar-item:hover` - Hover effect
- `.sidebar-item.active` - Currently selected item

**Used by**: Imported in admin navigation components

---

**Example**: `user/styles/home.css`

**What it contains**:
- Styles for user home page layout
- Welcome section with gradient
- Search bar styling
- Category filter chips
- Menu item cards grid
- Responsive breakpoints

**Classes defined**:
- `.user-home` - Page container
- `.welcome-section` - Hero banner
- `.search-input` - Search bar
- `.category-chip` - Category buttons
- `.menu-grid` - Grid layout for items
- `.menu-item-card` - Individual item card
- `.add-to-cart-btn` - Add to cart button

**Used by**: Imported in user/pages/Home.jsx

---

**Example**: `shared/styles/base.css`

**What it contains**:
- CSS reset (removes default browser styles)
- Scrollbar custom styling
- Utility animations (fadeIn, slideIn, spin)
- Screen reader only class

**Used by**: Imported once in main.jsx (affects entire app)

---

#### Index CSS Files

**Example**: `admin/styles/index.css`

**What it does**:
- Imports all admin CSS files in one place
- Defines CSS variables for admin theme colors

**What it imports**:
- navigation.css
- dashboard.css  
- pages.css

**How it works**:
- Admin components import this one file
- Gets all admin styles automatically
- Makes imports simpler and cleaner

---

## 🎨 How CSS Styling Works

### CSS Architecture

Each role has **completely separate styles** with no conflicts.

#### Import Pattern

**In a Component:**
```jsx
// user/pages/Home.jsx
import '../styles/home.css';  // Import specific page styles
// OR
import '../styles/index.css'; // Import all user styles
```

**In Main Entry:**
```jsx
// main.jsx
import './shared/styles/base.css';  // Import base reset once
```

#### CSS Class Naming Convention

**Pattern:** `.role-component-element`

**Examples:**
```css
/* Admin styles */
.admin-navbar { }
.admin-sidebar { }
.admin-btn-primary { }
.admin-card { }

/* Delivery styles */
.delivery-navbar { }
.delivery-order-card { }
.delivery-btn-primary { }

/* User styles */
.user-navbar { }
.user-cart { }
.user-btn-primary { }
```

#### Using Styles in JSX

**Method 1: CSS Classes**
```jsx
<div className="user-home">
  <div className="welcome-section">
    <h1 className="welcome-title">Welcome!</h1>
  </div>
  <button className="user-btn-primary">Shop Now</button>
</div>
```

**Method 2: MUI sx Prop** (inline styles)
```jsx
<Box sx={{ 
  padding: '24px',
  backgroundColor: '#f5f5f5',
  borderRadius: '12px'
}}>
  Content here
</Box>
```

**Method 3: MUI styled components**
```jsx
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
});
```

#### Responsive Design

All styles include mobile-first breakpoints:

```css
/* Mobile first - default */
.user-home {
  padding: 16px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .user-home {
    padding: 24px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .user-home {
    padding: 32px;
  }
}
```

---

## 🛣️ Routing System

### How Routes Work

**Route Definition** (`app/routes.jsx`)
```jsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';

// Admin pages
import AdminDashboard from '../admin/pages/Dashboard';
import AdminOrders from '../admin/pages/Orders';

// User pages
import UserHome from '../user/pages/Home';
import UserCart from '../user/pages/Cart';

// Auth pages
import Login from '../auth/Login';
import Signup from '../auth/Signup';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Admin routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/orders" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminOrders />
          </ProtectedRoute>
        } 
      />
      
      {/* Protected User routes */}
      <Route 
        path="/user" 
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserHome />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/user/cart" 
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserCart />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};
```

### Navigation Between Pages

**Method 1: useNavigate Hook**
```jsx
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/user/cart');  // Go to cart page
  };
  
  return <button onClick={handleClick}>Go to Cart</button>;
};
```

**Method 2: Link Component**
```jsx
import { Link } from 'react-router-dom';

const MyComponent = () => {
  return (
    <Link to="/user/orders">View Orders</Link>
  );
};
```

### Protected Routes

**How it works:**
```jsx
// auth/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Not logged in - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Wrong role - redirect to their dashboard
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  
  // Authorized - show the page
  return children;
};
```

---

## 🗃️ State Management

### Redux Store Setup

**Store Configuration** (`app/store.js`)
```jsx
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../auth/authSlice';
import cartReducer from '../user/slices/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,    // User authentication state
    cart: cartReducer,    // Shopping cart state
  },
});
```

### How Redux Slices Work

**Example: Cart Slice** (`user/slices/cartSlice.js`)
```jsx
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity, 
        0
      );
    },
    
    // Remove item from cart
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity, 
        0
      );
    },
    
    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

### Using Redux in Components

**Reading State** (useSelector)
```jsx
import { useSelector } from 'react-redux';

const MyComponent = () => {
  // Read from Redux store
  const { user } = useSelector((state) => state.auth);
  const { items, total } = useSelector((state) => state.cart);
  
  return (
    <div>
      <p>User: {user?.name}</p>
      <p>Cart Items: {items.length}</p>
      <p>Total: ${total}</p>
    </div>
  );
};
```

**Updating State** (useDispatch)
```jsx
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  
  const handleAddToCart = () => {
    // Dispatch action to update Redux store
    dispatch(addToCart(product));
  };
  
  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
};
```

---

## 👥 Role-Based Architecture

### Three Independent Modules

Each role (Admin, Delivery, User) is **completely independent**:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│     ADMIN       │  │    DELIVERY     │  │      USER       │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ - Components    │  │ - Components    │  │ - Components    │
│ - Pages         │  │ - Pages         │  │ - Pages         │
│ - Services      │  │ - Services      │  │ - Services      │
│ - State         │  │ - State         │  │ - State         │
│ - Styles        │  │ - Styles        │  │ - Styles        │
│ - Utils         │  │ - Utils         │  │ - Utils         │
└─────────────────┘  └─────────────────┘  └─────────────────┘
        │                    │                     │
        └────────────────────┴─────────────────────┘
                             │
                       ┌─────┴─────┐
                       │   SHARED  │
                       │  (Minimal)│
                       └───────────┘
```

### Role Access Flow

```
User Logs In
     │
     ├─ Role: Admin    → Redirect to /admin → Admin Dashboard
     ├─ Role: Delivery → Redirect to /delivery → Delivery Orders
     └─ Role: User     → Redirect to /user → User Home
```

### Folder Organization Per Role

**Each role folder has the same structure:**
```
role/
├── components/      # UI components for this role
├── pages/          # Page views for this role
├── hooks/          # Custom React hooks
├── services/       # API calls and backend logic
├── slices/         # Redux state management
├── utils/          # Helper functions & mock data
└── styles/         # CSS specific to this role
```

---

## 🔄 Data Flow

### Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERACTION                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
            ┌────────────────┐
            │  JSX Component │  (e.g., UserHome.jsx)
            │   - Displays   │
            │   - Handles    │
            └────────┬───────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
   ┌─────────┐           ┌──────────┐
   │  Redux  │           │  Local   │
   │  Store  │           │  State   │
   │(Global) │           │(useState)│
   └────┬────┘           └─────┬────┘
        │                      │
        │                      │
        ▼                      ▼
   ┌────────────────────────────┐
   │    Component Re-renders     │
   │     with Updated Data       │
   └────────────────────────────┘
```

### Example: Adding Item to Cart

**Step-by-Step Flow:**

1. **User clicks "Add to Cart" button**
   ```jsx
   // user/pages/Home.jsx
   <button onClick={() => handleAddToCart(item)}>
     Add to Cart
   </button>
   ```

2. **Component dispatches Redux action**
   ```jsx
   const dispatch = useDispatch();
   
   const handleAddToCart = (item) => {
     dispatch(addToCart(item));
   };
   ```

3. **Redux reducer updates state**
   ```jsx
   // user/slices/cartSlice.js
   addToCart: (state, action) => {
     state.items.push({ ...action.payload, quantity: 1 });
     state.total += action.payload.price;
   }
   ```

4. **Navbar reads updated state**
   ```jsx
   // user/components/Navbar.jsx
   const { items } = useSelector((state) => state.cart);
   const cartCount = items.length;  // Badge shows updated count
   ```

5. **UI automatically updates** (React re-renders affected components)

---

## ➕ Adding New Features

### How to Add a New Page

**Example: Adding "Favorites" page to User module**

**Step 1: Create the page component**
```jsx
// user/pages/Favorites.jsx
import { useState } from 'react';
import { Container } from '@mui/material';
import '../styles/pages.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  
  return (
    <Container className="user-page">
      <h1 className="page-title">My Favorites</h1>
      {/* Page content */}
    </Container>
  );
};

export default Favorites;
```

**Step 2: Add route**
```jsx
// app/routes.jsx
import Favorites from '../user/pages/Favorites';

// Add inside Routes component:
<Route 
  path="/user/favorites" 
  element={
    <ProtectedRoute allowedRoles={['user']}>
      <Favorites />
    </ProtectedRoute>
  } 
/>
```

**Step 3: Add navigation link**
```jsx
// user/components/Sidebar.jsx
const menuItems = [
  { text: 'Home', icon: <Home />, path: '/user' },
  { text: 'Favorites', icon: <Star />, path: '/user/favorites' },  // NEW
  { text: 'Cart', icon: <ShoppingCart />, path: '/user/cart' },
];
```

**Step 4: Create styles (optional)**
```css
/* user/styles/favorites.css */
.favorites-page {
  padding: 24px;
}

.favorite-item {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}
```

### How to Add a New Redux Slice

**Example: Adding "favorites" state**

**Step 1: Create slice**
```jsx
// user/slices/favoritesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
  },
  reducers: {
    addFavorite: (state, action) => {
      state.items.push(action.payload);
    },
    removeFavorite: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
```

**Step 2: Add to store**
```jsx
// app/store.js
import favoritesReducer from '../user/slices/favoritesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    favorites: favoritesReducer,  // NEW
  },
});
```

**Step 3: Use in components**
```jsx
import { useSelector, useDispatch } from 'react-redux';
import { addFavorite } from '../slices/favoritesSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.favorites);
  
  const isFavorite = items.some(item => item._id === product._id);
  
  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(product._id));
    } else {
      dispatch(addFavorite(product));
    }
  };
  
  return (
    <button onClick={toggleFavorite}>
      {isFavorite ? '❤️' : '🤍'}
    </button>
  );
};
```

### How to Add API Integration

**Step 1: Create service file**
```jsx
// user/services/menuService.js
import { api } from '../../config/api';  // Your API client

export const menuService = {
  // Get all menu items
  getMenuItems: async () => {
    const response = await api.get('/menu');
    return response.data;
  },
  
  // Get item by ID
  getMenuItem: async (id) => {
    const response = await api.get(`/menu/${id}`);
    return response.data;
  },
  
  // Search menu items
  searchMenu: async (query) => {
    const response = await api.get(`/menu/search?q=${query}`);
    return response.data;
  },
};
```

**Step 2: Use in component with useEffect**
```jsx
import { useState, useEffect } from 'react';
import { menuService } from '../services/menuService';

const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const data = await menuService.getMenuItems();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenu();
  }, []);
  
  if (loading) return <Loader />;
  
  return (
    <div>
      {items.map(item => (
        <div key={item._id}>{item.name}</div>
      ))}
    </div>
  );
};
```

---

## 🎯 Common Patterns

### 1. Loading States

```jsx
const [loading, setLoading] = useState(true);
const [data, setData] = useState(null);

useEffect(() => {
  fetchData();
}, []);

if (loading) return <Loader />;
if (!data) return <div>No data found</div>;

return <div>{/* Render data */}</div>;
```

### 2. Form Handling

```jsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = (e) => {
  e.preventDefault();
  console.log('Form data:', formData);
};

return (
  <form onSubmit={handleSubmit}>
    <input
      name="name"
      value={formData.name}
      onChange={handleChange}
    />
    <button type="submit">Submit</button>
  </form>
);
```

### 3. Conditional Rendering

```jsx
// Method 1: Ternary
{isLoggedIn ? <Dashboard /> : <Login />}

// Method 2: && operator
{error && <ErrorMessage error={error} />}

// Method 3: Function
const renderContent = () => {
  if (loading) return <Loader />;
  if (error) return <Error />;
  return <Content />;
};

return <div>{renderContent()}</div>;
```

### 4. Lists & Mapping

```jsx
const items = ['Apple', 'Banana', 'Orange'];

return (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

// With objects
const products = [
  { id: 1, name: 'Pizza', price: 299 },
  { id: 2, name: 'Burger', price: 199 },
];

return (
  <div>
    {products.map((product) => (
      <div key={product.id}>
        <h3>{product.name}</h3>
        <p>₹{product.price}</p>
      </div>
    ))}
  </div>
);
```

### 5. Event Handling

```jsx
// Click events
<button onClick={() => handleClick(item)}>Click Me</button>

// Input events
<input onChange={(e) => setValue(e.target.value)} />

// Form events
<form onSubmit={handleSubmit}>...</form>

// Prevent default
const handleSubmit = (e) => {
  e.preventDefault();
  // Your logic
};
```

---

## 📚 Quick Reference

### File Extensions
- `.jsx` - React components (JSX syntax)
- `.js` - Regular JavaScript (utilities, services)
- `.css` - Stylesheets

### Imports You'll Use Often

```jsx
// React
import { useState, useEffect } from 'react';

// Redux
import { useSelector, useDispatch } from 'react-redux';

// Router
import { useNavigate, Link } from 'react-router-dom';

// Material-UI
import { Box, Button, Container, Grid, Card } from '@mui/material';
import { Home, ShoppingCart, Person } from '@mui/icons-material';

// Your modules
import { addToCart } from '../slices/cartSlice';
import { MOCK_MENU_ITEMS } from '../utils/mockData';
import '../styles/index.css';
```

### Component Export Patterns

```jsx
// Default export (one per file)
export default MyComponent;

// Named exports (multiple per file)
export const Helper1 = () => {};
export const Helper2 = () => {};

// Import them
import MyComponent from './MyComponent';
import { Helper1, Helper2 } from './helpers';
```

---

## 🚀 Development Workflow

### Starting the App

1. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   ```
   http://localhost:5173
   ```

### Making Changes

1. Edit files in `src/` folder
2. Save - Vite auto-reloads the page
3. Check browser for changes
4. Fix any errors in console

### Building for Production

```bash
npm run build
```

Output goes to `client/dist/` folder.

---

## 🎓 Learning Path

**If you're new, learn in this order:**

1. **React Basics** - Components, Props, State
2. **JSX Syntax** - How to write HTML in JavaScript
3. **Hooks** - useState, useEffect, useSelector, useDispatch
4. **Routing** - How pages work with React Router
5. **Redux** - Global state management
6. **Material-UI** - Component library usage
7. **Project Structure** - Where things go

---

## 🆘 Troubleshooting

### Common Issues

**Issue: Component not rendering**
- Check if it's exported: `export default MyComponent`
- Check if route is defined in `routes.jsx`
- Check console for errors

**Issue: Styles not applying**
- Check if CSS file is imported
- Check class name spelling
- Check browser DevTools for CSS conflicts

**Issue: Redux state not updating**
- Check if action is dispatched: `dispatch(actionName())`
- Check if reducer is added to store
- Use Redux DevTools browser extension

**Issue: Navigation not working**
- Check if route path matches
- Check if user has correct role
- Check ProtectedRoute configuration

---

## 📖 Additional Resources

- **React Docs**: https://react.dev
- **Redux Toolkit**: https://redux-toolkit.js.org
- **React Router**: https://reactrouter.com
- **Material-UI**: https://mui.com
- **Vite**: https://vitejs.dev

---

## ✅ Summary

**This application is built with:**
- ✅ **React** for UI components
- ✅ **Redux** for state management
- ✅ **React Router** for navigation
- ✅ **Material-UI** for styled components
- ✅ **CSS** for custom styling
- ✅ **Role-based architecture** for separation
- ✅ **Modular structure** for maintainability

**Everything is organized by role (admin/delivery/user) to keep code clean, separate, and easy to understand!**

---

**Need help? Check the specific guides:**
- [RESTRUCTURE_GUIDE.md](RESTRUCTURE_GUIDE.md) - Project structure
- [STYLE_GUIDE.md](STYLE_GUIDE.md) - CSS styling guide
- [STYLES_SETUP_COMPLETE.md](STYLES_SETUP_COMPLETE.md) - Style setup details
