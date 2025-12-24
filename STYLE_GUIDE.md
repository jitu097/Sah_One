# Style Architecture Guide

## New CSS Structure

The project now has **completely separated styles** for each role. Each folder has its own CSS files with role-specific styling.

```
client/src/
├── admin/
│   └── styles/
│       ├── index.css          # Import all admin styles
│       ├── navigation.css     # Admin navbar, sidebar, bottom nav
│       ├── dashboard.css      # Admin dashboard specific
│       └── pages.css          # Common admin page styles
│
├── delivery/
│   └── styles/
│       ├── index.css          # Import all delivery styles
│       ├── navigation.css     # Delivery navbar, sidebar, bottom nav
│       └── pages.css          # Delivery page styles
│
├── user/
│   └── styles/
│       ├── index.css          # Import all user styles
│       ├── navigation.css     # User navbar, sidebar, bottom nav
│       ├── home.css           # User home page
│       ├── cart.css           # User cart page
│       └── pages.css          # Common user page styles
│
└── shared/
    └── styles/
        └── base.css           # Minimal reset & utilities only
```

## How to Use

### Import in Pages/Components

**Admin Components:**
```jsx
// In admin pages or components
import '../styles/index.css';  // Imports all admin styles
// OR import specific files
import '../styles/dashboard.css';
```

**Delivery Components:**
```jsx
// In delivery pages or components
import '../styles/index.css';  // Imports all delivery styles
```

**User Components:**
```jsx
// In user pages or components
import '../styles/index.css';  // Imports all user styles
// OR import specific files
import '../styles/home.css';
import '../styles/cart.css';
```

**Shared Base:**
```jsx
// In main.jsx or App.jsx only
import './shared/styles/base.css';  // Import once globally
```

## Style Classes Available

### Admin Classes

**Navigation:**
- `.admin-navbar` - Navbar container (purple gradient)
- `.admin-sidebar` - Sidebar menu
- `.admin-bottom-nav` - Mobile bottom navigation

**Dashboard:**
- `.admin-dashboard` - Main container
- `.stat-card` - Statistics cards with hover effects
- `.chart-container` - Chart wrappers
- `.data-table` - Table styles

**Common:**
- `.admin-page` - Page wrapper
- `.admin-card` - Card component
- `.admin-btn-primary` / `.admin-btn-secondary` - Buttons
- `.admin-form-group` - Form styling

### Delivery Classes

**Navigation:**
- `.delivery-navbar` - Navbar (green gradient)
- `.delivery-sidebar` - Sidebar menu
- `.delivery-bottom-nav` - Mobile navigation

**Pages:**
- `.delivery-page` - Page wrapper
- `.delivery-order-card` - Order card with status
- `.delivery-btn-primary` / `.delivery-btn-secondary` - Buttons
- `.delivery-stat-card` - Statistics display

### User Classes

**Navigation:**
- `.user-navbar` - Navbar with cart
- `.user-sidebar` - Sidebar menu
- `.user-bottom-nav` - Mobile navigation

**Home:**
- `.user-home` - Home page wrapper
- `.welcome-section` - Hero section
- `.quick-actions` - Quick action cards
- `.menu-grid` - Menu items grid
- `.menu-item-card` - Individual menu item

**Cart:**
- `.user-cart` - Cart page wrapper
- `.cart-items` - Cart items section
- `.cart-item` - Individual cart item
- `.cart-summary` - Order summary sidebar
- `.quantity-control` - Quantity buttons

**Common:**
- `.user-page` - Page wrapper
- `.user-card` - Card component
- `.user-btn-primary` / `.user-btn-secondary` - Buttons
- `.order-status` - Status badges
- `.profile-section` - Profile sections

### Shared Utilities

**Animations:**
- `.fade-in` - Fade in animation
- `.slide-in` - Slide in animation
- `.spinning` - Spinning animation

**Accessibility:**
- `.sr-only` - Screen reader only content

## Color Schemes

### Admin
- Primary: `#667eea` (Purple)
- Secondary: `#764ba2` (Dark Purple)
- Accent: `#f093fb` (Pink)
- Gradient: Purple to Dark Purple

### Delivery
- Primary: `#43e97b` (Green)
- Secondary: `#38f9d7` (Cyan)
- Accent: `#fa709a` (Pink)
- Gradient: Green to Cyan

### User
- Primary: `#667eea` (Purple)
- Secondary: `#764ba2` (Dark Purple)
- Accent: `#f093fb` (Pink)
- Gradient: Purple to Dark Purple

## CSS Variables (Coming Soon)

Each role has CSS variables defined in their `index.css`:

```css
/* Admin */
--admin-primary: #667eea;
--admin-secondary: #764ba2;
--admin-accent: #f093fb;

/* Delivery */
--delivery-primary: #43e97b;
--delivery-secondary: #38f9d7;
--delivery-accent: #fa709a;

/* User */
--user-primary: #667eea;
--user-secondary: #764ba2;
--user-accent: #f093fb;
```

**You can customize these variables later to change the theme!**

## Best Practices

### ✅ Do:
- Import role-specific styles in role components
- Use BEM-style class naming (e.g., `.admin-card__title`)
- Keep styles scoped to their role
- Use the provided utility classes for animations

### ❌ Don't:
- Import admin styles in user components (or vice versa)
- Add global styles except in `shared/styles/base.css`
- Override MUI component styles globally
- Use inline styles when CSS classes exist

## Responsive Design

All styles include mobile-first responsive design:

- **Mobile**: < 768px (bottom navigation shown)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (sidebar shown)

## Next Steps

1. **Theme Customization**: Edit CSS variables in each `index.css` file
2. **Add New Styles**: Create new CSS files in appropriate role's styles folder
3. **Dark Mode**: Can add dark mode variables in each role's index.css
4. **Animations**: Add more animations in shared/styles/base.css

## Migration from Global Styles

The old `styles/global.css` and `styles/theme.js` are now replaced:
- **Base reset** → `shared/styles/base.css`
- **Role styles** → Separate CSS files in each role folder
- **Theme** → Will be configured per role later

**No more global styling conflicts! Each role is independent.** 🎨
