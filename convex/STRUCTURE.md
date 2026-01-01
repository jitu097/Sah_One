# Convex Folder Structure

## Overview
This folder contains the backend logic for the application using Convex.

## Structure

```
convex/
├── convex.json          # Convex configuration (auto-generated)
├── schema/              # Database Models
├── modules/             # Feature Controllers
├── lib/                 # Services & Helpers
└── _generated/          # Auto-generated (DO NOT TOUCH)
```

## Folders & Files

### `schema/`
**Purpose:** Database schema definitions (equivalent to models in Node.js)
- `schema.ts` - Defines all database tables and their structure

### `modules/`
**Purpose:** Feature-based controllers and business logic

- **`auth/`** - Authentication operations (login, signup, logout)
- **`users/`** - User management (CRUD operations, profiles)
- **`menu/`** - Menu items management (add, edit, delete items)
- **`orders/`** - Order processing and management
- **`delivery/`** - Delivery tracking and assignment
- **`offers/`** - Promotions and offers management

### `lib/`
**Purpose:** Shared utilities and helper functions

- `auth.ts` - Authentication utilities and middleware
- `role.ts` - Role-based access control helpers

### `_generated/`
**Purpose:** Auto-generated Convex files (do not modify manually)
