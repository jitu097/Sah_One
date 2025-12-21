# Sah One - Food Delivery Backend

## Project Structure

```
server/
├── src/
│   ├── config/          # Database and Redis configuration
│   ├── models/          # Mongoose models
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middlewares
│   ├── services/        # Business logic
│   └── app.js           # Express app setup
├── server.js            # Server entry point
├── .env                 # Environment variables
├── package.json         # Dependencies
└── ecosystem.config.js  # PM2 configuration
```

## Installation

```bash
cd server
npm install
```

## Environment Setup

Copy `.env` file and configure your environment variables:
- MongoDB connection string
- Redis configuration
- JWT secret
- Payment gateway credentials

## Run Development Server

```bash
npm run dev
```

## Run Production Server

```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user
- POST `/api/auth/logout` - Logout user
- PUT `/api/auth/profile` - Update profile

### User Routes
- POST `/api/user/orders` - Create order
- GET `/api/user/orders/my-orders` - Get user orders
- GET `/api/user/orders/:id` - Get order by ID
- PUT `/api/user/orders/:id/cancel` - Cancel order
- GET `/api/user/orders/:id/track` - Track order

### Admin Routes
- GET `/api/admin/orders` - Get all orders
- PUT `/api/admin/orders/:id/status` - Update order status
- GET `/api/admin/menu` - Get menu items
- POST `/api/admin/menu` - Add menu item
- PUT `/api/admin/menu/:id` - Update menu item
- DELETE `/api/admin/menu/:id` - Delete menu item
- GET `/api/admin/stats` - Get dashboard stats
- GET `/api/admin/users` - Get all users

### Delivery Routes
- GET `/api/delivery/assigned-orders` - Get assigned orders
- PUT `/api/delivery/orders/:id/status` - Update delivery status
- PUT `/api/delivery/orders/:id/pickup` - Mark as picked up
- PUT `/api/delivery/orders/:id/deliver` - Mark as delivered
- GET `/api/delivery/history` - Get delivery history

## Notes

This is a boilerplate structure. Implement the business logic in controllers and services as needed.
