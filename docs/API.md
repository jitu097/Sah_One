# API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.sahone.com/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Routes

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Get Current User
```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "user",
    "address": []
  }
}
```

### Update Profile
```http
PUT /api/auth/profile
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "9876543210",
  "address": [
    {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001",
      "isDefault": true
    }
  ]
}
```

### Logout
```http
POST /api/auth/logout
```

---

## 👤 User Routes

### Create Order
```http
POST /api/user/orders
```

**Request Body:**
```json
{
  "items": [
    {
      "menuItem": "item_id",
      "quantity": 2
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001"
  },
  "paymentMethod": "card",
  "specialInstructions": "No onions please"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_id",
    "orderNumber": "ORD123456",
    "totalAmount": 599,
    "status": "pending",
    "estimatedDeliveryTime": "2025-12-21T15:30:00Z"
  }
}
```

### Get My Orders
```http
GET /api/user/orders/my-orders
```

**Query Parameters:**
- `status` (optional): pending, confirmed, preparing, out_for_delivery, delivered, cancelled
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "order_id",
      "orderNumber": "ORD123456",
      "items": [...],
      "totalAmount": 599,
      "status": "confirmed",
      "createdAt": "2025-12-21T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

### Get Order by ID
```http
GET /api/user/orders/:id
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_id",
    "orderNumber": "ORD123456",
    "items": [
      {
        "menuItem": {...},
        "quantity": 2,
        "price": 299
      }
    ],
    "totalAmount": 598,
    "status": "preparing",
    "deliveryAddress": {...},
    "estimatedDeliveryTime": "2025-12-21T15:30:00Z"
  }
}
```

### Track Order
```http
GET /api/user/orders/:id/track
```

**Response:**
```json
{
  "success": true,
  "tracking": {
    "status": "out_for_delivery",
    "currentLocation": {
      "lat": 19.0760,
      "lng": 72.8777
    },
    "estimatedArrival": "2025-12-21T15:30:00Z",
    "deliveryPerson": {
      "name": "Rahul Kumar",
      "phone": "9876543210"
    }
  }
}
```

### Cancel Order
```http
PUT /api/user/orders/:id/cancel
```

**Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

---

## 👨‍💼 Admin Routes

### Get All Orders
```http
GET /api/admin/orders
```

**Query Parameters:**
- `status`: Filter by status
- `date`: Filter by date (YYYY-MM-DD)
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "orders": [...],
  "pagination": {...}
}
```

### Update Order Status
```http
PUT /api/admin/orders/:id/status
```

**Request Body:**
```json
{
  "status": "confirmed",
  "estimatedDeliveryTime": "2025-12-21T15:30:00Z"
}
```

### Get Menu Items
```http
GET /api/admin/menu
```

**Query Parameters:**
- `category`: Filter by category
- `available`: Filter by availability (true/false)

**Response:**
```json
{
  "success": true,
  "items": [
    {
      "id": "item_id",
      "name": "Margherita Pizza",
      "description": "Classic pizza...",
      "price": 299,
      "category": "Pizza",
      "image": "https://...",
      "isAvailable": true
    }
  ]
}
```

### Add Menu Item
```http
POST /api/admin/menu
```

**Request Body:**
```json
{
  "name": "Margherita Pizza",
  "description": "Classic pizza with tomato sauce...",
  "price": 299,
  "category": "Pizza",
  "image": "https://...",
  "preparationTime": 20,
  "ingredients": ["tomato", "mozzarella", "basil"]
}
```

### Update Menu Item
```http
PUT /api/admin/menu/:id
```

**Request Body:**
```json
{
  "price": 349,
  "isAvailable": false
}
```

### Delete Menu Item
```http
DELETE /api/admin/menu/:id
```

### Get Dashboard Stats
```http
GET /api/admin/stats
```

**Query Parameters:**
- `period`: today, week, month, year

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalOrders": 347,
    "totalRevenue": 52340,
    "activeOrders": 12,
    "completedOrders": 320,
    "cancelledOrders": 15,
    "averageOrderValue": 485,
    "topSellingItems": [...],
    "revenueByDay": [...]
  }
}
```

### Get All Users
```http
GET /api/admin/users
```

**Query Parameters:**
- `role`: Filter by role (user, admin, delivery)
- `active`: Filter by active status (true/false)

---

## 🚚 Delivery Routes

### Get Assigned Orders
```http
GET /api/delivery/assigned-orders
```

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "order_id",
      "orderNumber": "ORD123456",
      "customer": {
        "name": "John Doe",
        "phone": "9876543210"
      },
      "deliveryAddress": {...},
      "items": [...],
      "totalAmount": 599,
      "status": "preparing"
    }
  ]
}
```

### Mark Order as Picked Up
```http
PUT /api/delivery/orders/:id/pickup
```

**Request Body:**
```json
{
  "otp": "1234"
}
```

### Update Delivery Status
```http
PUT /api/delivery/orders/:id/status
```

**Request Body:**
```json
{
  "status": "out_for_delivery",
  "currentLocation": {
    "lat": 19.0760,
    "lng": 72.8777
  }
}
```

### Mark Order as Delivered
```http
PUT /api/delivery/orders/:id/deliver
```

**Request Body:**
```json
{
  "otp": "1234",
  "deliveredAt": "2025-12-21T15:30:00Z"
}
```

### Get Delivery History
```http
GET /api/delivery/history
```

**Query Parameters:**
- `date`: Filter by date
- `page`: Page number
- `limit`: Items per page

---

## 📊 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "User role 'user' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## 🔄 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 📝 Order Status Flow

```
pending → confirmed → preparing → out_for_delivery → delivered
         ↓
      cancelled (can be cancelled at any stage before out_for_delivery)
```

## 🔒 Role-Based Access

- **User**: Can access user routes only
- **Admin**: Can access admin routes and user routes
- **Delivery**: Can access delivery routes and some user routes
