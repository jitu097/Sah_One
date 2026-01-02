# Restaurant Status Management System

## Overview
This system allows admins to control whether the restaurant is accepting orders or not through a toggle button in the admin panel.

## How It Works

### Admin Side
1. **Admin Navbar** has a toggle button labeled "Admin Panel" with status (OPEN/CLOSED)
2. Click the button to toggle between:
   - 🟢 **OPEN** (Green) - Restaurant accepts orders
   - 🔴 **CLOSED** (Red) - Restaurant is closed, users cannot order
3. Status is saved in `localStorage` and persists across sessions
4. Admin gets confirmation alert when toggling

### User Side
1. **First Visit When Closed**: Popup appears with message "Temporarily Unavailable"
2. User clicks "OK, Let me browse" to dismiss popup
3. Users can browse all menu items and pages
4. **When trying to add items to cart**: Alert appears preventing the action
5. Users can scroll, browse, and explore everything but cannot:
   - Add items to cart
   - Increase quantity of existing cart items
   - Place new orders

## Implementation

### Files Created/Modified

#### Admin Side:
- `admin/components/Navbar.jsx` - Toggle button implementation
- `admin/styles/navbar.css` - Button styling

#### User Side:
- `user/components/RestaurantStatus.jsx` - Popup modal component
- `user/components/RestaurantStatus.css` - Modal styling
- `user/pages/Home.jsx` - Added RestaurantStatus component
- `user/pages/Breakfast.jsx` - Added cart blocking logic
- `utils/restaurantStatus.js` - Helper functions for status management

### Usage in Other User Pages

To add cart blocking to other menu pages (Lunch, Dinner, etc.):

```jsx
import RestaurantStatus from '../components/RestaurantStatus';
import { safeAddToCart, safeUpdateQuantity } from '../../utils/restaurantStatus';

// In your component:
const handleAddToCart = (item) => {
  safeAddToCart(addToCart, item);
};

const handleUpdateQuantity = (itemId, change) => {
  safeUpdateQuantity(updateQuantity, itemId, change);
};

// In your JSX:
<RestaurantStatus />

// Use handleAddToCart instead of addToCart
// Use handleUpdateQuantity instead of updateQuantity
```

## Features
- ✅ Persistent status across browser tabs and sessions
- ✅ Real-time updates when admin changes status
- ✅ User-friendly popup notification
- ✅ Prevents orders while allowing browsing
- ✅ Smooth animations and transitions
- ✅ Responsive design for mobile devices

## Future Enhancements
- Connect to database to persist status server-side
- Add scheduled auto-open/close times
- Send notifications to active users when status changes
- Show estimated reopening time on closed popup
